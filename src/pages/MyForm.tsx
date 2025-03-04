import { Plus, Edit, Trash2, Copy, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router';
import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import {
  Backend,
  Response_2,
  Response_4,
} from '@/declarations/backend/backend.did';
import { toast } from 'sonner';
import { useCustomAuth } from '@/context/AuthContext';

export default function FormManagement() {
  const { loading: authLoading } = useCustomAuth();
  const {
    data,
    error,
    loading: formLoading,
  } = useQueryCall<Backend>({
    functionName: 'getOwnedForms',
  });
  const { call } = useUpdateCall<Backend>({
    functionName: 'createForm',
  });
  const forms = data as Response_2 | undefined | null;
  const navigate = useNavigate();

  const handleNewForm = () => {
    call()
      .then((response) => {
        const res = response as Response_4;
        if ('ok' in res) {
          navigate(`/forms/${res.ok}`);
        } else {
          toast.error(res.err);
        }
      })
      .catch((error) => {
        // toast.error(error);
        console.error(error);
      });
  };

  return (
    <div className="container mx-auto py-10 px-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Forms</h1>
          <p className="text-muted-foreground mt-1">
            Manage and create your forms
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create New Form Card */}
        <Card
          onClick={handleNewForm}
          className="border-dashed h-full flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <CardContent className="flex flex-col items-center justify-center pt-6 pb-6 h-full">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Create New Form</h3>
            <p className="text-muted-foreground text-center mt-2">
              Start building a new form for your needs
            </p>
          </CardContent>
        </Card>

        {/* Existing Forms */}
        {forms &&
          'ok' in forms &&
          forms.ok.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {form.metadata.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {form.metadata.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant={form.metadata.published ? 'default' : 'secondary'}
                  >
                    {form.metadata.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <div className="text-sm">
                  <span className="font-medium">TODO</span> responses
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/forms/${form.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
