browser.runtime.onMessage.addListener(function(result){
    if (result == 1){
        console.log("Warning: Phishing detected!!");
        alert("Warning: Phishing detected!!");
    }
    // else if (result == -1){
    //     console.log("No phishing detected");
    //     alert("No phishing detected");
    // }
});
