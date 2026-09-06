var twLSN = ['warung-emak-ati-rt12.blogspot.com'];
function cekLSN(value,arr){ var status = false; for(var i=0; i<arr.length; i++){ var name = arr[i]; if(name == value){ status = true; break; } } return status; } var hst = window.location.hostname; if(cekLSN(hst, twLSN) == false) { window.location.href = 'https://warung-emak-ati-rt12.blogspot.com'; }
