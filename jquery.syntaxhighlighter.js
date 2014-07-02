/* 
** jquery.syntaxhighlighter.js - v0.0.5
** Author: Christopher Vachon (code@christophervachon.com) 
** Build Date 2014-04-02 
** Repository: https://github.com/liaodrake/jquery.syntaxhighlighter.js
*/
(function ( $ ) {
	$(window).on("resize",function resizeWindow() {
		$('table.syntax-highlighting').each(function() {
			$(this).find('td.code div[data-line]').each(function() {
				$(this).closest('table').find('td.gutter div[data-line="' + $(this).attr('data-line') + '"]').height($(this).height());
			});
		});
	});
	$.fn.highlightSyntax = function( options ) {
		console.log(document.location.pathname);

		var _settings = $.extend(true,{
			tab: "&nbsp;&nbsp;&nbsp;&nbsp;",
			splitLinesRegEx: "\\r\\n|\\r|\\n|<br(?:\\s\\/)?>",
			defaultDefinition: "code",
			definitionsPath: "/definitions/",
			definitions: {
				"html": [
					{
						class: "html",
						pattern: "((?:\<|&lt;)[^\>\&]+(\>|\&gt;))"
					}
				],
				"code": [
					{
						class: "string",
						pattern: "((?:\"|')[^\"']{0,}(?:\"|'))"
					}, {
						class: 'regex',
						pattern: "(\\/[^\\/]+\\/[gim]{0,})"
					}, {
						class: 'const',
						pattern: "(?:(var|new|function|private|if|else|for|in)\\s)"
					}, {
						class: 'operator',
						pattern: "((?:[\\+\\-\\=\\!\\|\\:\\[\\]\\(\\)\\{\\}\\>\\<]|&amp;|&lt;|&gt;){1,}|(?:[^\\*\\/]\\/(?!\\/|\\*)))"
					}, {
						class: 'comment',
						pattern: "\\/\\/[^\\(\\n|\\r)]+|\\/\\*|\\*\\/"
					}
				]
			}
		}, options );


		return this.each(function() {
			var _codeDefinitionTitle = $(this).attr('data-lang') || $(this).attr("class") || _settings.defaultDefinition;
			_codeDefinitionTitle = _codeDefinitionTitle.replace("lang-","");
			var _table = $('<table>').addClass('syntax-highlighting')
				.append($('<tr>')
					.append($('<th>').prop('colspan',2).addClass('header').text(_codeDefinitionTitle))
				).append($('<tr>')
					.append($('<td>').addClass('gutter'))
					.append($('<td>').addClass('code'))
				);
			var _thisCodeBlock = $(this);
			getDefinitions(_codeDefinitionTitle,_settings).done(function(_definitions) {

				var _computedRegExString = "";
				for (var k in _definitions) { _computedRegExString += _definitions[k].pattern + "|"; }
				_computedRegExString = "(" + _computedRegExString.replace(/\|$/, "") + ")";
				var _computedRegEx = new RegExp(_computedRegExString, "gi");

				var _splitCodeRegEx = new RegExp(_settings.splitLinesRegEx, "gi");
				var _code = _thisCodeBlock.html().split(_splitCodeRegEx);
				var _numLines = (_code.length - 1);
				//console.log(_code);
				for (var i = 0; i <= _numLines; i++) {
					var _hightlightedCode = _code[i].replace(/\t|\s{4}/g,_settings.tab);
					_hightlightedCode = _hightlightedCode.replace(_computedRegEx, "<span class='found'>$1</span>");
					_hightlightedCode = $('<div>').attr('data-line',i).html(_hightlightedCode || "&nbsp;");
					_table.find('td.gutter').append($('<div>').attr('data-line',i).html(i + 1));
					_table.find('td.code').append(_hightlightedCode);
				}
				_table.find('td.code .found').each(function applyHighlighting() {
					$(this).removeClass('found').addClass(swapClassesForSyntaxHighlighting($(this),_definitions));
				});

				_thisCodeBlock.closest('pre').replaceWith(_table);


				_table.find('td.code div[data-line]').each(function() {
					$(this).closest('table').find('td.gutter div[data-line="' + $(this).attr('data-line') + '"]').height($(this).height());
				}); 

			}); // close getDefinitions()
		}); // close this.each()
	};
	function swapClassesForSyntaxHighlighting(_block,_patterns) {
		for (var j in _patterns) {
			var _regEx = new RegExp(_patterns[j].pattern,"gi");
			if (_block.html().match(_regEx)) {
				return _patterns[j].class;
			}
		}
		return "found";
	}
	function getDefinitions(_definitionName,_settings) {
		var _deff = $.Deferred();

		if (_settings.definitions[_definitionName]) {
			_deff.resolve(_settings.definitions[_definitionName]);
		} else {
			var _timestamp = new Date().getTime();
			$.getJSON(_settings.definitionsPath + _definitionName.toLowerCase() + '.definition.json?timestamp=' + _timestamp ,function(_data) {
				_settings.definitions[_definitionName] = _data;
			}).fail(function() {
				_definitionName = _settings.defaultDefinition;
			}).always(function () {
				_deff.resolve(_settings.definitions[_definitionName]);
			});
		}

		return _deff.promise();
	}
}( jQuery ));