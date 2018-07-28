$(function() {

	// Text Area CKEditor
	if ($('textarea#ta').length) {
		CKEDITOR.replace('ta');
	}

	// Confirm Deletion Alert
	$('a.confirmDeletion').on('click', () => {
		if (!confirm('Confirm Deletion'))
			return false;
	});

	// Fancybox 
	if ($("[data-fancybox").length) {
		$("[data-fancybox").fancybox();
	}
});