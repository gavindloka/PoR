'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, RefreshCw, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function GetVerifiedPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );

        const imageData = canvasRef.current.toDataURL('image/png');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const submitVerification = () => {
    alert('Verification submitted successfully!');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center pt-10 px-20 font-satoshi">
      <Card className="w-full border-purple-200 shadow-lg">
        <CardHeader className="bg-purple-700 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <CardTitle className="text-2xl font-bold">Get Verified</CardTitle>
          </div>
          <CardDescription className="text-purple-100">
            Capture a clear photo of yourself to authenticate your identity
            before accessing/ creating the surveys
          </CardDescription>
        </CardHeader>

        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 p-6">
            <div className="flex justify-center">
              <div className="relative rounded-lg w-full h-96 overflow-hidden bg-black">
                {!isCameraActive && !capturedImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-purple-900/80">
                    <User className="h-16 w-16 mb-2 opacity-70" />
                    <p className="text-center px-4">
                      Click the button to start the camera
                    </p>
                  </div>
                )}

                {capturedImage ? (
                  <img
                    src={capturedImage || '/placeholder.svg'}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col">
            <div className="space-y-4 mb-6 flex-grow">
              <h3 className="font-medium text-purple-800 text-lg">
                Verification Guidelines:
              </h3>
              <ul className="text-gray-600 space-y-3">
                {[
                  'Ensure your face is clearly visible',
                  'Remove sunglasses or any face coverings',
                  'Find a well-lit environment',
                  'Look directly at the camera',
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-purple-100">
                <h4 className="font-medium text-purple-800 mb-2">
                  Why we need verification:
                </h4>
                <p className="text-gray-600">
                  Verification helps us maintain a secure platform and protect
                  our community from fraud. Your identity will be kept
                  confidential and only used for verification purposes.
                </p>
              </div>
            </div>

            <div className="mt-auto">
              {!isCameraActive && !capturedImage ? (
                <Button
                  onClick={startCamera}
                  className="w-full bg-purple-700 hover:bg-purple-800"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              ) : !capturedImage ? (
                <Button
                  onClick={capturePhoto}
                  className="w-full bg-purple-700 hover:bg-purple-800"
                >
                  Take Photo
                </Button>
              ) : (
                <div className="flex gap-3 w-full">
                  <Button
                    onClick={retakePhoto}
                    variant="outline"
                    className="flex-1 border-purple-300"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retake
                  </Button>
                  <Button
                    onClick={submitVerification}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit
                  </Button>
                </div>
              )}

              <p className="text-xs text-center text-purple-700 mt-3">
                Your photo will only be used for verification purposes
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
