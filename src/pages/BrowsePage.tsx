'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import {
  Award,
  Calendar,
  ChevronRight,
  Clock,
  FlameIcon as Fire,
  Heart,
  Search,
  Star,
  Trophy,
  Users,
} from 'lucide-react';

// Sample data for surveys
const featuredSurveys = [
  {
    id: 1,
    title: 'Consumer Preferences in Sustainable Products',
    category: 'Market Research',
    creator: 'GreenTech Research',
    creatorAvatar: '/placeholder.svg?height=40&width=40',
    participants: 1245,
    reward: '5 ICP',
    estimatedTime: '10 min',
    tags: ['sustainability', 'consumer-behavior', 'eco-friendly'],
    featured: true,
    trending: true,
    deadline: '2025-04-15',
  },
  {
    id: 2,
    title: 'Remote Work Productivity Study',
    category: 'Workplace',
    creator: 'Future of Work Institute',
    creatorAvatar: '/placeholder.svg?height=40&width=40',
    participants: 3782,
    reward: '8 ICP',
    estimatedTime: '15 min',
    tags: ['remote-work', 'productivity', 'work-life-balance'],
    featured: true,
    trending: false,
    deadline: '2025-04-10',
  },
  {
    id: 3,
    title: 'Digital Payment Adoption Trends',
    category: 'Finance',
    creator: 'Blockchain Analytics',
    creatorAvatar: '/placeholder.svg?height=40&width=40',
    participants: 2156,
    reward: '10 ICP',
    estimatedTime: '12 min',
    tags: ['fintech', 'digital-payments', 'cryptocurrency'],
    featured: true,
    trending: true,
    deadline: '2025-04-20',
  },
];

const allSurveys = [
  ...featuredSurveys,
  {
    id: 4,
    title: 'Mental Health in Tech Industry',
    category: 'Health',
    creator: 'Wellness Research Group',
    creatorAvatar: '/placeholder.svg?height=40&width=40',
    participants: 1876,
    reward: '7 ICP',
    estimatedTime: '20 min',
    tags: ['mental-health', 'tech-industry', 'workplace-wellness'],
    featured: false,
    trending: false,
    deadline: '2025-04-25',
  },
  {
    id: 5,
    title: 'AI Ethics and Public Perception',
    category: 'Technology',
    creator: 'AI Ethics Coalition',
    creatorAvatar: '/placeholder.svg?height=40&width=40',
    participants: 2543,
    reward: '12 ICP',
    estimatedTime: '18 min',
    tags: ['ai', 'ethics', 'technology'],
    featured: false,
    trending: true,
    deadline: '2025-04-18',
  },
  {
    id: 6,
    title: 'Online Learning Effectiveness',
    category: 'Education',
    creator: 'EdTech Research',
    creatorAvatar: '/placeholder.svg?height=40&width=40',
    participants: 1532,
    reward: '6 ICP',
    estimatedTime: '15 min',
    tags: ['education', 'online-learning', 'edtech'],
    featured: false,
    trending: false,
    deadline: '2025-04-30',
  },
  {
    id: 7,
    title: 'Social Media Usage Patterns',
    category: 'Social',
    creator: 'Digital Behavior Lab',
    creatorAvatar: '/placeholder.svg?height=40&width=40',
    participants: 4231,
    reward: '9 ICP',
    estimatedTime: '12 min',
    tags: ['social-media', 'digital-behavior', 'screen-time'],
    featured: false,
    trending: true,
    deadline: '2025-04-22',
  },
  {
    id: 8,
    title: 'Sustainable Transportation Preferences',
    category: 'Environment',
    creator: 'Green Mobility Project',
    creatorAvatar: '/placeholder.svg?height=40&width=40',
    participants: 1876,
    reward: '7 ICP',
    estimatedTime: '14 min',
    tags: ['transportation', 'sustainability', 'urban-planning'],
    featured: false,
    trending: false,
    deadline: '2025-05-05',
  },
  {
    id: 9,
    title: 'Nutrition and Diet Trends',
    category: 'Health',
    creator: 'Nutritional Science Institute',
    creatorAvatar: '/placeholder.svg?height=40&width=40',
    participants: 2187,
    reward: '8 ICP',
    estimatedTime: '16 min',
    tags: ['nutrition', 'diet', 'health-trends'],
    featured: false,
    trending: false,
    deadline: '2025-04-28',
  },
];

// Categories for filtering
const categories = [
  'All Categories',
  'Market Research',
  'Workplace',
  'Finance',
  'Health',
  'Technology',
  'Education',
  'Social',
  'Environment',
];

const BrowseSurveys = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Filter surveys based on search query and category
  const filteredSurveys = allSurveys.filter((survey) => {
    const matchesSearch =
      survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      survey.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' ||
      survey.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort surveys based on selected sort option
  const sortedSurveys = [...filteredSurveys].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      case 'reward':
        return Number.parseInt(b.reward) - Number.parseInt(a.reward);
      case 'popularity':
        return b.participants - a.participants;
      default:
        return 0;
    }
  });

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

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
          {/* Featured Surveys */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-bold text-purple-900">
                  Featured Surveys
                </h2>
              </div>
              <Button variant="link" className="text-purple-700 font-medium">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSurveys.map((survey) => (
                <motion.div
                  key={survey.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden border-purple-100 hover:shadow-md transition-all">
                    <CardHeader className="pb-2 relative">
                      <div className="absolute right-6 top-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => toggleFavorite(survey.id)}
                        >
                          <Heart
                            className={`h-5 w-5 ${favoriteIds.includes(survey.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                          />
                          <span className="sr-only">Add to favorites</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                          {survey.category}
                        </Badge>
                        {survey.trending && (
                          <Badge
                            variant="outline"
                            className="border-orange-300 text-orange-600 flex items-center gap-1"
                          >
                            <Fire className="h-3 w-3" /> Trending
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-purple-900">
                        {survey.title}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={survey.creatorAvatar}
                            alt={survey.creator}
                          />
                          <AvatarFallback>{survey.creator[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">
                          {survey.creator}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    {/* Make CardContent grow to push footer down */}
                    <CardContent className="pb-2 flex-grow">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {survey.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-purple-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                          <Users className="h-4 w-4 text-purple-600 mb-1" />
                          <span className="font-medium text-purple-900">
                            {survey.participants.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            Participants
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                          <Award className="h-4 w-4 text-purple-600 mb-1" />
                          <span className="font-medium text-purple-900">
                            {survey.reward}
                          </span>
                          <span className="text-xs text-gray-500">Reward</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                          <Clock className="h-4 w-4 text-purple-600 mb-1" />
                          <span className="font-medium text-purple-900">
                            {survey.estimatedTime}
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
                            {new Date(survey.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-purple-700 hover:bg-purple-800"
                        >
                          Participate
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="mb-8">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <TabsList className="bg-purple-100">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  >
                    All Surveys
                  </TabsTrigger>
                  <TabsTrigger
                    value="trending"
                    className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  >
                    Trending
                  </TabsTrigger>
                  <TabsTrigger
                    value="newest"
                    className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  >
                    Newest
                  </TabsTrigger>
                  <TabsTrigger
                    value="ending-soon"
                    className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  >
                    Ending Soon
                  </TabsTrigger>
                </TabsList>

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
                          <SelectItem key={category} value={category}>
                            {category}
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

              <TabsContent value="all" className="mt-0">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {sortedSurveys.map((survey) => (
                    <motion.div
                      key={survey.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="h-full flex flex-col overflow-hidden border-purple-100 hover:shadow-md transition-all">
                        <CardHeader className="pb-2 relative">
                          <div className="absolute right-6 top-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => toggleFavorite(survey.id)}
                            >
                              <Heart
                                className={`h-5 w-5 ${favoriteIds.includes(survey.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                              />
                              <span className="sr-only">Add to favorites</span>
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                              {survey.category}
                            </Badge>
                            {survey.trending && (
                              <Badge
                                variant="outline"
                                className="border-orange-300 text-orange-600 flex items-center gap-1"
                              >
                                <Fire className="h-3 w-3" /> Trending
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl text-purple-900">
                            {survey.title}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage
                                src={survey.creatorAvatar}
                                alt={survey.creator}
                              />
                              <AvatarFallback>
                                {survey.creator[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">
                              {survey.creator}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        {/* Make CardContent grow to push footer down */}
                        <CardContent className="pb-2 flex-grow">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {survey.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-purple-50"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                              <Users className="h-4 w-4 text-purple-600 mb-1" />
                              <span className="font-medium text-purple-900">
                                {survey.participants.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">
                                Participants
                              </span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                              <Award className="h-4 w-4 text-purple-600 mb-1" />
                              <span className="font-medium text-purple-900">
                                {survey.reward}
                              </span>
                              <span className="text-xs text-gray-500">
                                Reward
                              </span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                              <Clock className="h-4 w-4 text-purple-600 mb-1" />
                              <span className="font-medium text-purple-900">
                                {survey.estimatedTime}
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
                                {new Date(survey.deadline).toLocaleDateString()}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-purple-700 hover:bg-purple-800"
                            >
                              Participate
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="trending" className="mt-0">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {sortedSurveys
                    .filter((survey) => survey.trending)
                    .map((survey) => (
                      <motion.div
                        key={survey.id}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="h-full flex flex-col overflow-hidden border-purple-100 hover:shadow-md transition-all">
                          <CardHeader className="pb-2 relative">
                            <div className="absolute right-6 top-6">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => toggleFavorite(survey.id)}
                              >
                                <Heart
                                  className={`h-5 w-5 ${favoriteIds.includes(survey.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                                />
                                <span className="sr-only">
                                  Add to favorites
                                </span>
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                {survey.category}
                              </Badge>
                              {survey.trending && (
                                <Badge
                                  variant="outline"
                                  className="border-orange-300 text-orange-600 flex items-center gap-1"
                                >
                                  <Fire className="h-3 w-3" /> Trending
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl text-purple-900">
                              {survey.title}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-2">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage
                                  src={survey.creatorAvatar}
                                  alt={survey.creator}
                                />
                                <AvatarFallback>
                                  {survey.creator[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                {survey.creator}
                              </span>
                            </CardDescription>
                          </CardHeader>
                          {/* Make CardContent grow to push footer down */}
                          <CardContent className="pb-2 flex-grow">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {survey.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-purple-50"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                                <Users className="h-4 w-4 text-purple-600 mb-1" />
                                <span className="font-medium text-purple-900">
                                  {survey.participants.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Participants
                                </span>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                                <Award className="h-4 w-4 text-purple-600 mb-1" />
                                <span className="font-medium text-purple-900">
                                  {survey.reward}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Reward
                                </span>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                                <Clock className="h-4 w-4 text-purple-600 mb-1" />
                                <span className="font-medium text-purple-900">
                                  {survey.estimatedTime}
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
                                  {new Date(
                                    survey.deadline,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                className="bg-purple-700 hover:bg-purple-800"
                              >
                                Participate
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="newest" className="mt-0">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[...sortedSurveys]
                    .sort(
                      (a, b) =>
                        new Date(b.deadline).getTime() -
                        new Date(a.deadline).getTime(),
                    )
                    .slice(0, 6)
                    .map((survey) => (
                      <motion.div
                        key={survey.id}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="h-full flex flex-col overflow-hidden border-purple-100 hover:shadow-md transition-all">
                          <CardHeader className="pb-2 relative">
                            <div className="absolute right-6 top-6">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => toggleFavorite(survey.id)}
                              >
                                <Heart
                                  className={`h-5 w-5 ${favoriteIds.includes(survey.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                                />
                                <span className="sr-only">
                                  Add to favorites
                                </span>
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                {survey.category}
                              </Badge>
                              {survey.trending && (
                                <Badge
                                  variant="outline"
                                  className="border-orange-300 text-orange-600 flex items-center gap-1"
                                >
                                  <Fire className="h-3 w-3" /> Trending
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl text-purple-900">
                              {survey.title}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-2">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage
                                  src={survey.creatorAvatar}
                                  alt={survey.creator}
                                />
                                <AvatarFallback>
                                  {survey.creator[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                {survey.creator}
                              </span>
                            </CardDescription>
                          </CardHeader>
                          {/* Make CardContent grow to push footer down */}
                          <CardContent className="pb-2 flex-grow">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {survey.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-purple-50"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                                <Users className="h-4 w-4 text-purple-600 mb-1" />
                                <span className="font-medium text-purple-900">
                                  {survey.participants.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Participants
                                </span>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                                <Award className="h-4 w-4 text-purple-600 mb-1" />
                                <span className="font-medium text-purple-900">
                                  {survey.reward}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Reward
                                </span>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                                <Clock className="h-4 w-4 text-purple-600 mb-1" />
                                <span className="font-medium text-purple-900">
                                  {survey.estimatedTime}
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
                                  {new Date(
                                    survey.deadline,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                className="bg-purple-700 hover:bg-purple-800"
                              >
                                Participate
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="ending-soon" className="mt-0">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[...sortedSurveys]
                    .sort(
                      (a, b) =>
                        new Date(a.deadline).getTime() -
                        new Date(b.deadline).getTime(),
                    )
                    .slice(0, 6)
                    .map((survey) => (
                      <motion.div
                        key={survey.id}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="h-full flex flex-col overflow-hidden border-purple-100 hover:shadow-md transition-all">
                          <CardHeader className="pb-2 relative">
                            <div className="absolute right-6 top-6">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => toggleFavorite(survey.id)}
                              >
                                <Heart
                                  className={`h-5 w-5 ${favoriteIds.includes(survey.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                                />
                                <span className="sr-only">
                                  Add to favorites
                                </span>
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                {survey.category}
                              </Badge>
                              {survey.trending && (
                                <Badge
                                  variant="outline"
                                  className="border-orange-300 text-orange-600 flex items-center gap-1"
                                >
                                  <Fire className="h-3 w-3" /> Trending
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl text-purple-900">
                              {survey.title}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-2">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage
                                  src={survey.creatorAvatar}
                                  alt={survey.creator}
                                />
                                <AvatarFallback>
                                  {survey.creator[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                {survey.creator}
                              </span>
                            </CardDescription>
                          </CardHeader>
                          {/* Make CardContent grow to push footer down */}
                          <CardContent className="pb-2 flex-grow">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {survey.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-purple-50"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                                <Users className="h-4 w-4 text-purple-600 mb-1" />
                                <span className="font-medium text-purple-900">
                                  {survey.participants.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Participants
                                </span>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                                <Award className="h-4 w-4 text-purple-600 mb-1" />
                                <span className="font-medium text-purple-900">
                                  {survey.reward}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Reward
                                </span>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                                <Clock className="h-4 w-4 text-purple-600 mb-1" />
                                <span className="font-medium text-purple-900">
                                  {survey.estimatedTime}
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
                                  {new Date(
                                    survey.deadline,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                className="bg-purple-700 hover:bg-purple-800"
                              >
                                Participate
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* No Results State */}
          {sortedSurveys.length === 0 && (
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
                  setSelectedCategory('All Categories');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {sortedSurveys.length > 0 && (
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
