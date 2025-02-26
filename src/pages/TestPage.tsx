import { Button } from "@/components/ui/button"
import { useAuth, useQueryCall, useUpdateCall } from "@ic-reactor/react"
import { FileInput } from "lucide-react"
import { useEffect, useState } from "react"

const TestPage = () => {
    const { identity } = useAuth();
    const { loading, data: user, refetch } = useQueryCall({
        functionName: 'getUser'
    })
    const [blob, setBlob] = useState<Uint8Array>();
    const [isCameraActive, setCameraActive] = useState(false);
    const { call, data } = useUpdateCall({
        functionName: 'verify',
        args: [blob],
        onLoading: (loading) => console.log('Loading:', loading),
        onError: (error) => console.error('Error:', error),
        onSuccess: (data) => console.log('Success:', data),
    })

    const startCamera = () => {
        let constraints = { audio: false, video: { width: 1280, height: 720 } };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function (mediaStream) {
                let video = document.querySelector("video");
                if (!video) return;

                video.srcObject = mediaStream;
                video.onloadedmetadata = function (e) {
                    if (video) video.play();
                };
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            }); // always check for errors at the end.
        setCameraActive((active) => !active)
    }

    async function capture_image(): Promise<
        [ArrayBuffer | undefined, { scale: number; x: number; y: number }] | undefined
    > {
        let video = document.querySelector("video");
        if (!video) return;

        let canvas = document.querySelector("canvas");
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Target dimensions
        const targetWidth = 320;
        const targetHeight = 240;
        let scale = Math.min(targetWidth / video.videoWidth, targetHeight / video.videoHeight);
        let newWidth = video.videoWidth * scale;
        let newHeight = video.videoHeight * scale;
        let x = (targetWidth - newWidth) / 2;
        let y = (targetHeight - newHeight) / 2;

        // Set canvas size *before* drawing
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.clearRect(0, 0, targetWidth, targetHeight);
        context.drawImage(video, x, y, newWidth, newHeight);
        console.log("yeet");

        const serialize = async (canvas: HTMLCanvasElement): Promise<ArrayBuffer | undefined> => {
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        blob.arrayBuffer().then(resolve);
                    } else {
                        resolve(undefined);
                    }
                }, "image/png", 0.9);
            });
        };

        let bytes = await serialize(canvas);
        return [bytes, { scale, x, y }];
    }

    const handleSubmit = async () => {
        const imageResult = await capture_image();
        if (!imageResult) {
            return;
        }


        const [blob, scaling] = imageResult;
        if (!blob) {
            return;
        }

        if (!identity) {
            return;
        }

        setBlob(new Uint8Array(blob));
        // call([identity.getPrincipal(), new Uint8Array(blob)]);
    }

    return (
        <div>
            <p>{JSON.stringify(user)}</p>
            <div className="flex">
                <video autoPlay={true} id="video" style={{ width: 320, height: 320 }}></video>
                <canvas width={320} height={320}></canvas>
            </div>
            <Button onClick={startCamera}>{isCameraActive ? "Stop" : "Start"} Camera</Button>
            {isCameraActive &&
                <Button onClick={handleSubmit}>Take Picture</Button>
            }
            {!(identity?.getPrincipal().isAnonymous() === false) && <p>LOGIN FIRST</p>}
            {blob && identity?.getPrincipal().isAnonymous() === false && <UploadComponent blob={blob} />}
            <div>{JSON.stringify(data)}</div>
        </div>
    )
}



const UploadComponent = ({ blob }: { blob: Uint8Array }) => {
    const { call, data } = useUpdateCall({
        functionName: 'verify',
        args: [blob],
        onLoading: (loading) => console.log('Loading:', loading),
        onError: (error) => console.error('Error:', error),
        onSuccess: (data) => console.log('Success:', data),
    })

    const download = () => {
        const blobFile = new Blob([blob], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blobFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Button onClick={call}>Upload</Button>
            <Button onClick={download}>Download</Button>
            <div>{JSON.stringify(data)}</div>
        </>
    )
}

export default TestPage