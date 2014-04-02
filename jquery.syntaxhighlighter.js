/* 
** jquery.syntaxhighlighter.js - v0.0.2
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
		var _settings = $.extend({
			tab: "&nbsp;&nbsp;&nbsp;&nbsp;",
			splitLinesRegEx: "\\r\\n|\\r|\\n|<br(?:\\s\\/)?>",
			definitions: {
				default: [{
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
				}]
			}
		}, options );

		var _table = $('<table>').addClass('syntax-highlighting').append($('<tr>')
			.append($('<td>').addClass('gutter'))
			.append($('<td>').addClass('code'))
		);

		var _definitions = _settings.definitions.default;

		var _computedRegExString = "";
		for (var k in _definitions) { _computedRegExString += _definitions[k].pattern + "|"; }
		_computedRegExString = "(" + _computedRegExString.replace(/\|$/, "") + ")";
		var _computedRegEx = new RegExp(_computedRegExString, "gi");

		var _splitCodeRegEx = new RegExp(_settings.splitLinesRegEx, "gi");
		var _code = $(this).html().split(_splitCodeRegEx);
		var _numLines = (_code.length - 1);
		//console.log(_code);
		for (var i = 0; i <= _numLines; i++) {
			var _hightlightedCode = _code[i].replace(/\t/g,_settings.tab);
			_hightlightedCode = _hightlightedCode.replace(_computedRegEx, "<span class='found'>$1</span>");
			_hightlightedCode = $('<div>').attr('data-line',i).html(_hightlightedCode || "&nbsp;");
			_table.find('td.gutter').append($('<div>').attr('data-line',i).html(i + 1));
			_table.find('td.code').append(_hightlightedCode);
		}
		_table.find('td.code .found').each(function applyHighlighting() {
			$(this).removeClass('found').addClass(swapClassesForSyntaxHighlighting($(this),_definitions));
		});

		this.closest('pre').replaceWith(_table);


		_table.find('td.code div[data-line]').each(function() {
			$(this).closest('table').find('td.gutter div[data-line="' + $(this).attr('data-line') + '"]').height($(this).height());
		});


		return this;
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
}( jQuery ));