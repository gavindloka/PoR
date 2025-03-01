'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CheckCircle, ImageUp, RefreshCw, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth, useQueryCall, useUpdateCall } from '@ic-reactor/react';
import { toast } from 'sonner';
import type { Backend, Response_1 } from '../declarations/backend/backend.did';
import { Link } from 'react-router';

export default function GetVerifiedPage() {
  const { identity } = useAuth();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blob, setBlob] = useState<Uint8Array>();
  const [isVerified, setIsVerified] = useState<Boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('camera');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    loading,
    error,
    data: rawUser,
    refetch,
  } = useQueryCall<Backend>({
    functionName: 'getUser',
  });

  const user = rawUser as Response_1 | undefined;

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      } else {
        console.error('No video element found');
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

  const resetUpload = useCallback(() => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'camera') {
      resetUpload();
    } else if (activeTab === 'upload') {
      stopCamera();
      setCapturedImage(null);
    }
  }, [activeTab, resetUpload, stopCamera]);

  useEffect(() => {
    console.log('Blob Updated:', blob);
  }, [blob]);

  async function captureImage(): Promise<void> {
    const video = videoRef.current;
    if (!video) {
      console.error('No video element found');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('No canvas element found');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('No canvas context found');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const imageData = canvas.toDataURL('image/png');
    console.log('Captured Image:', imageData);
    setCapturedImage(imageData);

    const serialize = async (
      canvas: HTMLCanvasElement,
    ): Promise<ArrayBuffer | undefined> => {
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              blob.arrayBuffer().then(resolve);
            } else {
              resolve(undefined);
            }
          },
          'image/png',
          0.9,
        );
      });
    };

    const bytes = await serialize(canvas);
    if (!bytes) {
      console.error('Failed to serialize image');
      return;
    }

    setBlob(new Uint8Array(bytes));

    stopCamera();
  }

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSubmit = async () => {
    if (!blob) {
      console.error('No image captured for submission.');
      return;
    }

    if (!identity) {
      console.error('No identity found.');
      return;
    }

    console.log('Submitting stored image...');

    call();
  };

  useEffect(() => {
    if (isVerified) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isVerified]);

  const { call, data } = useUpdateCall({
    functionName: 'verify',
    args: [blob],
    onLoading: (loading) => {
      console.log('Loading:', loading);
      if (loading) {
        toast.loading('Submitting verification...', {
          id: 'verification-loading',
        });
      }
    },
    onError: (error) => {
      console.error('Error:', error);
      toast.error('Verification failed', {
        id: 'verification-submission',
        description:
          'There was an error processing your verification. Please try again.',
        action: {
          label: 'Try Again',
          onClick: () => handleSubmit(),
        },
      });
    },
    onSuccess: (data) => {
      console.log('Success:', data);

      const response = data as { err?: string };

      if (response.err) {
        toast.error('Verification failed', {
          id: 'verification-error',
          description: response.err,
        });
      } else {
        toast.success('Verification successful', {
          id: 'verification-submission',
          description: 'Your identity has been verified successfully.',
        });
        setIsVerified(true);
      }
      setTimeout(() => {
        toast.dismiss('verification-loading');
      }, 3000);
      // console.log("ini user "+user);
    },
  });

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Please upload an image smaller than 5MB.',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file (JPEG, PNG, etc.).',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);

      const binaryString = atob(result.split(',')[1]);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      setBlob(bytes);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 px-20 font-satoshi">
      {!loading && user && 'err' in user && (
        <Card className="w-full border-purple-200 shadow-lg">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <CardTitle className="text-2xl font-bold">Get Verified</CardTitle>
            </div>
            <CardDescription className="text-purple-100">
              Capture a clear photo of yourself to authenticate your identity
              before accessing/creating surveys.
            </CardDescription>
          </CardHeader>
          <div className="flex border-b border-purple-200">
            <button
              className={`px-4 py-3 font-medium text-sm flex items-center ${
                activeTab === 'camera'
                  ? 'text-purple-700 border-b-2 border-purple-700'
                  : 'text-gray-500 hover:text-purple-600'
              }`}
              onClick={() => setActiveTab('camera')}
            >
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm flex items-center ${
                activeTab === 'upload'
                  ? 'text-purple-700 border-b-2 border-purple-700'
                  : 'text-gray-500 hover:text-purple-600'
              }`}
              onClick={() => setActiveTab('upload')}
            >
              <User className="mr-2 h-4 w-4" />
              Upload Photo
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 p-6">
              <div className="flex justify-center">
                <div className="relative rounded-lg w-full h-96 overflow-hidden bg-black">
                  {activeTab === 'camera' ? (
                    <>
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
                    </>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center bg-black">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      {uploadedImage ? (
                        <img
                          src={uploadedImage || '/placeholder.svg'}
                          alt="Uploaded"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6">
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-purple-900/80">
                            <ImageUp className="h-16 w-16 mb-2 opacity-70" />
                            <p className="text-center px-4">
                              Please upload a clear photo of your face for
                              verification
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col">
              <div className="space-y-4 mb-6 flex-grow">
                <h3 className="font-medium text-purple-800 text-xl flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Verification Guidelines
                </h3>
                <ul className="text-gray-600 space-y-3 ml-3">
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
                  <h4 className="font-medium text-purple-800 text-xl flex items-center mb-2">
                    <Shield className="mr-2 h-5 w-5" />
                    Why we need verification?
                  </h4>
                  <p className="text-gray-600">
                    Verification helps us maintain a secure platform and protect
                    our community from fraud. Your identity will be kept
                    confidential and only used for verification purposes.
                  </p>
                </div>
              </div>

              <div className="mt-auto">
                {activeTab === 'camera' ? (
                  !isCameraActive && !capturedImage ? (
                    <Button
                      onClick={startCamera}
                      className="w-full bg-purple-700 hover:bg-purple-800"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera
                    </Button>
                  ) : !capturedImage ? (
                    <Button
                      onClick={captureImage}
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
                        onClick={handleSubmit}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Submit
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="flex gap-3 w-full">
                    {uploadedImage ? (
                      <>
                        <Button
                          onClick={resetUpload}
                          variant="outline"
                          className="flex-1 border-purple-300"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Choose Another
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Submit
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={triggerFileUpload}
                        className="w-full bg-purple-700 hover:bg-purple-800"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Choose Photo
                      </Button>
                    )}
                  </div>
                )}
                <p className="text-xs text-center text-purple-700 mt-3">
                  Your photo will only be used for verification purposes
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {!loading && user && 'ok' in user && (
        <Card className="w-full border-green-300 shadow-lg">
          <CardHeader className="bg-green-700 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              <CardTitle className="text-2xl font-bold">
                Verification Completed
              </CardTitle>
            </div>
            <CardDescription className="text-green-100">
              Your identity has been verified successfully.
            </CardDescription>
          </CardHeader>

          <div className="p-6 text-center text-gray-700">
            <p>Welcome, {user.ok.name.length || 'User'}!</p>
            <p>Your account is already verified</p>
            <p>
              You can visit your profile{' '}
              <Link to="/profile" className=" underline hover:text-purple-600">
                here
              </Link>
            </p>
          </div>
        </Card>
      )}

      {loading && <p>Loading...</p>}

      {error && <p>{error.message}</p>}
    </div>
  );
}
