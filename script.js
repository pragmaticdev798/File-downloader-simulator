async function downloadFile() {
    let url = document.getElementById("fileUrl").value;
    if (!url) return alert("Please enter a file URL!");
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Failed to download file!");
        let contentLength = response.headers.get("Content-Length");
        if (!contentLength) throw new Error("Cannot track progress (content-Length missing");
        contentLength = parseInt(contentLength);
        let reader = response.body.getReader();
        let receiveBytes = 0;
        let chunks = [];
        while (true) {
            let { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receiveBytes += value.length;
            let percent = (receiveBytes / contentLength) * 100;
            document.getElementById("progress-bar").style.width = percent + "%";
        }
        let blob = new Blob(chunks);
        let blobUrl = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = blobUrl;
        a.download = url.split("/").pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
        alert("Download Complete ✅");
    } catch (error) {
        alert("❌Error:" + error.message);
    }
}


