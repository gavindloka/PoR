'use client';

import { Backend } from '@/components/FormPreview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryCall } from '@ic-reactor/react';
import { motion } from 'framer-motion';
import {
  Award,
  Calendar,
  ChevronRight,
  Clock,
  Search,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

const categories = [
  { id: "all", name: "All Categories" },
  { id: "technology", name: "Technology" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "business", name: "Business" },
  { id: "finance", name: "Finance" },
  { id: "marketing", name: "Marketing" },
  { id: "entertainment", name: "Entertainment" },
  { id: "sports", name: "Sports" },
  { id: "travel", name: "Travel" },
  { id: "food", name: "Food" },
  { id: "fashion", name: "Fashion" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "social-issues", name: "Social Issues" },
  { id: "politics", name: "Politics" },
  { id: "environment", name: "Environment" },
  { id: "science", name: "Science" },
  { id: "psychology", name: "Psychology" },
  { id: "consumer-behavior", name: "Consumer Behavior" },
  { id: "education-research", name: "Education Research" },
  { id: "economics", name: "Economics" },
  { id: "job-satisfaction", name: "Job Satisfaction" },
  { id: "customer-feedback", name: "Customer Feedback" },
  { id: "product-research", name: "Product Research" },
  { id: "market-trends", name: "Market Trends" },
  { id: "real-estate", name: "Real Estate" },
  { id: "public-opinion", name: "Public Opinion" },
  { id: "self-improvement", name: "Self-Improvement" },
  { id: "parenting", name: "Parenting" },
  { id: "mental-health", name: "Mental Health" },
  { id: "relationships", name: "Relationships" },
  { id: "career-development", name: "Career Development" },
  { id: "finance-investment", name: "Finance & Investment" },
  { id: "technology-adoption", name: "Technology Adoption" },
  { id: "online-shopping", name: "Online Shopping" },
  { id: "workplace-culture", name: "Workplace Culture" },
  { id: "media-consumption", name: "Media Consumption" },
  { id: "gaming", name: "Gaming" },
  { id: "transportation", name: "Transportation" },
  { id: "sustainability", name: "Sustainability" },
  { id: "government-policy", name: "Government Policy" },
  { id: "cryptocurrency", name: "Cryptocurrency" },
  { id: "blockchain", name: "Blockchain" },
  { id: "artificial-intelligence", name: "Artificial Intelligence" },
  { id: "space-exploration", name: "Space Exploration" },
  { id: "pet-care", name: "Pet Care" },
  { id: "fitness-wellness", name: "Fitness & Wellness" },
  { id: "human-rights", name: "Human Rights" },
  { id: "volunteering", name: "Volunteering" }
];

const BrowseSurveys = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const { data, loading, error } = useQueryCall<Backend, 'getAllForms'>({
    functionName: 'getAllForms'
  });

  // Filter surveys based on search query and category
  const filteredSurveys = (data && "ok" in data) ? data.ok.filter((survey) => {
    const matchesSearch =
      survey.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.metadata.categories.some((category) =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'all' ||
      survey.metadata.categories.includes(selectedCategory);

    const isPublished = survey.metadata.published;

    return matchesSearch && matchesCategory && isPublished;
  }) : null;

  // Sort surveys based on selected sort option
  const sortedSurveys = filteredSurveys ? [...filteredSurveys].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return Number((b.metadata.deadline[0] ?? 0n) - (a.metadata.deadline[0] ?? 0n));
      case 'reward':
        return Number(b.metadata.rewardAmount) - Number(a.metadata.rewardAmount);
      case 'popularity':
        return b.responses.length - a.responses.length;
      default:
        return 0;
    }
  }) : null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-white to-purple-50 min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-16 px-4 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Discover Surveys
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-purple-100 max-w-2xl mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Find and participate in decentralized surveys that match your
              interests and earn rewards
            </motion.p>

            <motion.div
              className="w-full max-w-3xl relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
                <Input
                  type="text"
                  placeholder="Search for surveys by title, category, or tags..."
                  className="pl-10 py-6 bg-white/10 border-purple-400 text-white placeholder:text-purple-200 focus:ring-purple-300 focus:border-purple-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full px-4 md:px-8 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Tabs and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="reward">Highest Reward</SelectItem>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {!sortedSurveys && <div>Loading...</div>}
              {sortedSurveys && sortedSurveys.map((survey) => (
                <motion.div
                  key={survey.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden border-purple-100 hover:shadow-md transition-all">
                    <CardHeader className="pb-2 relative">
                      <div className="flex items-center gap-2 mb-2">
                        {survey.metadata.categories.map((category, index) =>
                          <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                            {category}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-purple-900">
                        {survey.metadata.title}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <span className="text-sm text-gray-600">
                          By {survey.creator.toString()}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    {/* Make CardContent grow to push footer down */}
                    <CardContent className="pb-2 flex-grow">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                          <Users className="h-4 w-4 text-purple-600 mb-1" />
                          <span className="font-medium text-purple-900">
                            {survey.responses.length}
                          </span>
                          <span className="text-xs text-gray-500">
                            Participants
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                          <Award className="h-4 w-4 text-purple-600 mb-1" />
                          <span className="font-medium text-purple-900">
                            {Number(survey.metadata.rewardAmount / 100_000_000n)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Reward
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                          <Clock className="h-4 w-4 text-purple-600 mb-1" />
                          <span className="font-medium text-purple-900">
                            {survey.questions.length * 2} minutes
                          </span>
                          <span className="text-xs text-gray-500">
                            Est. Time
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    {/* Footer stays at the bottom */}
                    <CardFooter className="pt-2 mt-auto">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            Ends:{' '}
                            {new Date(Number(survey.metadata.deadline[0] ?? 0n)).toLocaleDateString()}
                          </span>
                        </div>
                        <Link to={`/forms/${survey.id}/answer`}>
                          <Button
                            size="sm"
                            className="bg-purple-700 hover:bg-purple-800"
                          >
                            Participate
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* No Results State */}
          {sortedSurveys && sortedSurveys.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">
                No surveys found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We couldn't find any surveys matching your search criteria. Try
                adjusting your filters or search terms.
              </p>
              <Button
                variant="outline"
                className="border-purple-300 text-purple-700"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {sortedSurveys && sortedSurveys.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-purple-200"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 border-purple-200 bg-purple-700 text-white"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 border-purple-200"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 border-purple-200"
                >
                  3
                </Button>
                <span className="mx-1">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 border-purple-200"
                >
                  12
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-purple-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowseSurveys;
