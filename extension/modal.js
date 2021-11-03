class Modal {
	static ui(result) {
		if (result == 1)
			$.sweetModal({
				title: 'Phishing Detector',
				content: 'Dangerous Webpage !!',
				icon: $.sweetModal.ICON_WARNING,

				buttons: [
					{
						label: 'Go Back',
						classes: 'greenB',
						action: () => {
							window.history.back();
						}
					},
					{
						label: 'Continue',
						classes: 'redB',
					}
				]
			});
		else
			$.sweetModal({
				title: 'Phishing Detector',
				content: 'Safe Webpage !!',
				icon: $.sweetModal.ICON_SUCCESS,

				buttons: [
					{
						label: 'Continue',
						classes: 'greenB',
					}
				]
			});
	}
}
