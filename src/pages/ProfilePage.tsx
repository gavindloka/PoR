import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';
import { Country, CountryDropdown } from '@/components/ui/country-dropdown';
import { useEffect, useState } from 'react';
import { Select } from '@radix-ui/react-select';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OccupationDropdown } from '@/components/ui/occupation-dropdown';
import { useAuth, useQueryCall, useUpdateCall } from '@ic-reactor/react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Mars as Male, Venus as Female } from "lucide-react"

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

const ProfilePage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const { call, data, loading } = useUpdateCall({
    functionName: 'updateUser',
    args: [],
    onLoading: (loading) => console.log('Loading:', loading),
    onError: (error) => console.error('Error:', error),
    onSuccess: (data) => console.log('Success:', data),
  });

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

  const { data: user, refetch } = useQueryCall({
    functionName: 'getUser',
  });

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { name, age, gender, city, country, occupation } = values;

      const updateUserArgs = [
        name ? [name] : [],
        age ? [Number.parseInt(age)] : [17],
        gender ? [gender] : ['male'],
        country ? [country] : [],
        city ? [city] : [],
        occupation ? [occupation] : [],
      ];

      const result = await call(updateUserArgs);
      console.log("result"+JSON.stringify(result));
      if(result){
        toast.success('Profile updated successfully');
      }else{
        toast.error('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  const handleCountryChange = (country: Country) => {
    console.log('Selected Country: ', country.name);
    setSelectedCountry(country.alpha3);
    form.setValue('country', country.name);
  };

  return (
    <>
      <div className="flex py-10 w-full items-center justify-center px-20">
        <Card className="mx-auto min-w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Profile</CardTitle>
            <CardDescription>Your Personal Information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(form.getValues());
                }}
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="name">Full Name</FormLabel>
                        <FormControl>
                          <Input id="name" placeholder="John Doe" {...field} />
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
                        <FormLabel htmlFor="age">Age</FormLabel>
                        <FormControl>
                          <Input
                            id="age"
                            placeholder="25"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

<FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4 pt-2"
                          >
                            <Label
                              htmlFor="male"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-purple-700"
                            >
                              <RadioGroupItem value="male" id="male" className="sr-only" />
                              <Male className="mb-3 h-6 w-6" />
                              <span className="text-sm font-medium leading-none">Male</span>
                            </Label>
                            <Label
                              htmlFor="female"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-purple-700"
                            >
                              <RadioGroupItem value="female" id="female" className="sr-only" />
                              <Female className="mb-3 h-6 w-6" />
                              <span className="text-sm font-medium leading-none">Female</span>
                            </Label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="city">City</FormLabel>
                        <FormControl>
                          <Input id="city" placeholder="Jakarta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="country">Country</FormLabel>
                        <FormControl>
                          <CountryDropdown
                            placeholder="Select your country"
                            defaultValue={selectedCountry}
                            onChange={handleCountryChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <OccupationDropdown
                            onChange={(occupation) =>
                              form.setValue('occupation', occupation.name)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-purple-700 hover:bg-purple-800 font-bold"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Submit'}
                  </Button>
                  {/* {error && (
                    <div className="text-red-500">{JSON.stringify(error)}</div>
                  )} */}
                </div>
              </form>
            </Form>
            {/* <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="#" className="underline">
                Login
              </Link>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;
