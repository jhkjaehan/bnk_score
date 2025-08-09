(function($) {
	$.fn.toPrice = function(cipher) {
		var strb, len, revslice, minus;
		minus = '';
		strb = $(this).val().toString();
		if (strb.charAt(0) == '-')
			minus = strb.charAt(0);
		strb = strb.replace(/-,/g, '');
		strb = $(this).getOnlyNumeric();
		strb = parseInt(strb, 10);
		if (isNaN(strb)) {
			return $(this).val(minus + '');
		}
		strb = strb.toString();
		len = strb.length;

		if (len < 4) {
			return $(this).val(minus + strb);
		}
		if (cipher == undefined || !isNumeric(cipher))
			cipher = 3;

		count = len / cipher;
		slice = new Array();

		for ( var i = 0; i < count; ++i) {
			if (i * cipher >= len)
				break;
			slice[i] = strb.slice((i + 1) * -cipher, len - (i * cipher));
		}

		revslice = slice.reverse();
		return $(this).val(minus + revslice.join(','));
	};
	
	$.fn.toNum = function(cipher) {
		var strb, minus;
		minus = '';
		strb = $(this).val().toString();
		if (strb.charAt(0) == '-')
			minus = strb.charAt(0);
		strb = strb.replace(/-,/g, '');
		strb = $(this).getOnlyNumeric();
		strb = parseInt(strb, 10);
		if (isNaN(strb)) {
			return $(this).val(minus + '');
		}else{
			return $(this).val(minus + strb);
		}
		
	};
	
	$.fn.toEng = function(cipher) {
		var strb;
		strb = $(this).val().toString();
		strb = strb.replace(/[^a-zA-Z]/g, '');
		return $(this).val(strb);
	};
	
	$.fn.toEngNum = function(cipher) {
		var strb;
		strb = $(this).val().toString();
		strb = strb.replace(/[^a-zA-Z0-9]/g, '');
		return $(this).val(strb);
	};

	$.fn.getOnlyNumeric = function(data) {
		var chrTmp, strTmp;
		var len, str;

		if (data == undefined) {
			str = $(this).val();
		} else {
			str = data;
		}

		len = str.length;
		strTmp = '';

		for ( var i = 0; i < len; ++i) {
			chrTmp = str.charCodeAt(i);
			if ((chrTmp > 47 || chrTmp <= 31) && chrTmp < 58) {
				strTmp = strTmp + String.fromCharCode(chrTmp);
			}
		}

		if (data == undefined)
			return strTmp;
		else
			return $(this).val(strTmp);
	};

	var isNumeric = function(data) {
		var len, chrTmp;

		len = data.length;
		for ( var i = 0; i < len; ++i) {
			chrTmp = str.charCodeAt(i);
			if ((chrTmp <= 47 && chrTmp > 31) || chrTmp >= 58) {
				return false;
			}
		}

		return true;
	};
})(jQuery);