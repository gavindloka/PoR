import { Button } from '@/components/ui/button';
import {
  ActorProvider,
  CandidAdapterProvider,
  useAuth,
  useQueryCall,
  useUpdateCall,
  useUserPrincipal,
} from '@ic-reactor/react';
import { Calendar, FileInput, User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Country, CountryDropdown } from '@/components/ui/country-dropdown';
import { z } from 'zod';
import { OccupationDropdown } from '@/components/ui/occupation-dropdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { e } from 'react-router/dist/development/route-data-BmvbmBej';
import { idlFactory } from '@/declarations/icp_ledger_canister';
import { Principal } from '@ic-reactor/react/dist/types';
import { Principal as DFinityPrincipal } from '@dfinity/principal';
import { icp_ledger_canister } from '@/declarations/icp_ledger_canister';
export type ICPLedger = typeof icp_ledger_canister;
const TestPage = () => {
  const { identity } = useAuth();
  const {
    loading,
    data: user,
    refetch,
  } = useQueryCall({
    functionName: 'getUser',
  });
  const [open, setOpen] = useState(false);
  const [blob, setBlob] = useState<Uint8Array>();
  const [isCameraActive, setCameraActive] = useState(false);
  const { call: verifyCall, data: verifyData } = useUpdateCall({
    functionName: 'verify',
    args: [blob],
    onLoading: (loading) => console.log('Loading:', loading),
    onError: (error) => console.error('Error:', error),
    onSuccess: (data) => console.log('Success:', data),
  });

  const startCamera = () => {
    let constraints = { audio: false, video: { width: 1280, height: 720 } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (mediaStream) {
        let video = document.querySelector('video');
        if (!video) return;

        video.srcObject = mediaStream;
        video.onloadedmetadata = function (e) {
          if (video) video.play();
        };
      })
      .catch(function (err) {
        console.log(err.name + ': ' + err.message);
      }); // always check for errors at the end.
    setCameraActive((active) => !active);
  };

  async function capture_image(): Promise<
    | [ArrayBuffer | undefined, { scale: number; x: number; y: number }]
    | undefined
  > {
    let video = document.querySelector('video');
    if (!video) return;

    let canvas = document.querySelector('canvas');
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Target dimensions
    const targetWidth = 320;
    const targetHeight = 240;
    let scale = Math.min(
      targetWidth / video.videoWidth,
      targetHeight / video.videoHeight,
    );
    let newWidth = video.videoWidth * scale;
    let newHeight = video.videoHeight * scale;
    let x = (targetWidth - newWidth) / 2;
    let y = (targetHeight - newHeight) / 2;

    // Set canvas size *before* drawing
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    context.clearRect(0, 0, targetWidth, targetHeight);
    context.drawImage(video, x, y, newWidth, newHeight);
    console.log('yeet');

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
  };
  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' }),
    age: z
      .string()
      .min(1, { message: 'Age is required' })
      .refine((val) => !isNaN(Number.parseInt(val)), {
        message: 'Age must be a number',
      }),
    gender: z.string().min(1, { message: 'Gender is required' }),
    city: z.string().min(2, { message: 'City must be at least 2 characters' }),
    country: z.string().min(1, { message: 'Country is required' }),
    occupation: z.string().min(1, { message: 'Occupation is required' }),
  });
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '',
      gender: '',
      city: '',
      country: '',
      occupation: '',
    },
  });
  const handleCountryChange = (country: Country) => {
    console.log('Selected Country: ', country.name);
    setSelectedCountry(country.alpha3);
    form.setValue('country', country.name);
  };
  const [icp, seticp] = useState(0);
  const [icpPool, seticpPool] = useState(0);
  const [respondent, setRespondent] = useState(0);
  const principal = useUserPrincipal() as DFinityPrincipal;

  const { call, data, error } = useQueryCall<ICPLedger, 'icrc2_transfer_from'>({
    functionName: 'icrc2_transfer_from',
    canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    args: [
      {
        from: {
          owner: principal, // Sender's principal
          subaccount: [], // Optional subaccount
        },
        to: {
          owner: DFinityPrincipal.fromText('be2us-64aaa-aaaaa-qaabq-cai'),
          subaccount: [],
        },
        amount: BigInt(5000),
        fee: [], // Use `undefined` for optional fields
        spender_subaccount: [],
        memo: [],
        created_at_time: [],
      },
    ],
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Submitting transaction...');
    call();
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="flex items-center gap-2">
            <User size={16} />
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <Tabs defaultValue="requirements" className="w-full">
            <DialogHeader className="px-6 pt-6 pb-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">
                  Form Details
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground mt-1">
                Configure your form requirements and set up rewards for
                respondents.
              </DialogDescription>
              <TabsList className="p-5 ">
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              <Separator className="mt-4" />
            </DialogHeader>

            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <TabsContent value="requirements" className="mt-0 space-y-6">
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">
                                Time Settings
                              </CardTitle>
                              <CardDescription>
                                Set the deadline for form submissions
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div className="flex items-center gap-4">
                                  <Calendar className="text-muted-foreground h-5 w-5" />
                                  <div className="flex-1">
                                    <Label htmlFor="deadline">
                                      Deadline{' '}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id="deadline"
                                      type="date"
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">
                                Age Requirements
                              </CardTitle>
                              <CardDescription>
                                Define age range for respondents
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="min-age">
                                      Minimum Age [Optional]
                                    </Label>
                                    <Input
                                      id="min-age"
                                      placeholder="ex. At least 20 y.o "
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="max-age">
                                      Maximum Age [Optional]
                                    </Label>
                                    <Input
                                      id="max-age"
                                      placeholder="ex. Maximum 40 y.o "
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">
                                Location & Occupation
                              </CardTitle>
                              <CardDescription>
                                Set location and occupation requirements
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label
                                      htmlFor="country"
                                      className="block mb-1"
                                    >
                                      Country [Optional]
                                    </Label>
                                    <FormControl>
                                      <CountryDropdown
                                        placeholder="Select your country"
                                        value={form.watch('country')}
                                        onChange={(country) =>
                                          form.setValue(
                                            'country',
                                            country.alpha3,
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor="city"
                                      className="block mb-1"
                                    >
                                      City [Optional]
                                    </Label>
                                    <Input id="city" placeholder="Enter city" />
                                  </div>
                                </div>

                                <div>
                                  <Label
                                    htmlFor="occupation"
                                    className="block mb-1"
                                  >
                                    Occupation [Optional]
                                  </Label>
                                  <FormControl>
                                    <OccupationDropdown
                                      value={form.watch('occupation')}
                                      onChange={(occupation) =>
                                        form.setValue(
                                          'occupation',
                                          occupation.id,
                                        )
                                      }
                                    />
                                  </FormControl>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </TabsContent>

              <TabsContent value="rewards" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reward Settings</CardTitle>
                    <CardDescription>
                      Configure ICP rewards for respondents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="reward-amount">
                          Reward Amount (ICP)
                        </Label>
                        <Input
                          id="reward-amount"
                          type="number"
                          placeholder="0.01"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reward-pool">
                          Total Reward Pool (ICP)
                        </Label>
                        <Input
                          id="reward-pool"
                          type="number"
                          placeholder="10.00"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-respondents">
                          Maximum Respondents
                        </Label>
                        <Input
                          id="max-respondents"
                          type="number"
                          placeholder="1000"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            <form onSubmit={onSubmit}>
              <DialogFooter className="px-6 py-4 border-t">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Publish Form</Button>{' '}
                {/* Use type="submit" */}
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>

      <p>{JSON.stringify(user)}</p>
      <div className="flex">
        <video
          autoPlay={true}
          id="video"
          style={{ width: 320, height: 320 }}
        ></video>
        <canvas width={320} height={320}></canvas>
      </div>
      <Button onClick={startCamera}>
        {isCameraActive ? 'Stop' : 'Start'} Camera
      </Button>
      {isCameraActive && <Button onClick={handleSubmit}>Take Picture</Button>}
      {!(identity?.getPrincipal().isAnonymous() === false) && (
        <p>LOGIN FIRST</p>
      )}
      {blob && identity?.getPrincipal().isAnonymous() === false && (
        <UploadComponent blob={blob} />
      )}
      {/* <div>{JSON.stringify(data)}</div> */}
    </div>
  );
};

const UploadComponent = ({ blob }: { blob: Uint8Array }) => {
  const { call, data } = useUpdateCall({
    functionName: 'verify',
    args: [blob],
    onLoading: (loading) => console.log('Loading:', loading),
    onError: (error) => console.error('Error:', error),
    onSuccess: (data) => console.log('Success:', data),
  });

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
  );
};

export default TestPage;
