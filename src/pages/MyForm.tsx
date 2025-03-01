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
import { Link } from 'react-router';

// Sample data for demonstration
const forms = [
  {
    id: '1',
    title: 'Customer Feedback',
    description: 'Collect feedback from customers about our services',
    responses: 24,
    lastUpdated: '2 days ago',
    status: 'active',
  },
  {
    id: '2',
    title: 'Event Registration',
    description: 'Registration form for the annual conference',
    responses: 156,
    lastUpdated: '5 days ago',
    status: 'active',
  },
  {
    id: '3',
    title: 'Job Application',
    description: 'Application form for software developer position',
    responses: 78,
    lastUpdated: '1 week ago',
    status: 'active',
  },
  {
    id: '4',
    title: 'Product Survey',
    description: 'Survey about our new product features',
    responses: 42,
    lastUpdated: '3 days ago',
    status: 'draft',
  },
  {
    id: '5',
    title: 'Newsletter Signup',
    description: 'Form to collect email subscriptions',
    responses: 310,
    lastUpdated: '1 day ago',
    status: 'active',
  },
];

export default function FormManagement() {
  return (
    <div className="container mx-auto py-10 px-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Forms</h1>
          <p className="text-muted-foreground mt-1">
            Manage and create your forms
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Form
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create New Form Card */}
        <Link to="/forms/new" className="block h-full">
          <Card className="border-dashed h-full flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
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
        </Link>

        {/* Existing Forms */}
        {forms.map((form) => (
          <Card key={form.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{form.title}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {form.description}
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
                  variant={form.status === 'active' ? 'default' : 'secondary'}
                >
                  {form.status === 'active' ? 'Active' : 'Draft'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Updated {form.lastUpdated}
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
              <div className="text-sm">
                <span className="font-medium">{form.responses}</span> responses
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
