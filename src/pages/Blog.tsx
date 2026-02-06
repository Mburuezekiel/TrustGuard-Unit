 import { useState, useEffect } from "react";
 import { Link } from "react-router-dom";
 import { ShieldIcon } from "@/components/icons/ShieldIcon";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Calendar, Clock, User, Search, ArrowRight } from "lucide-react";
 import {Header} from "@/components/Header";
 
 interface BlogPost {
   id: string;
   title: string;
   excerpt: string;
   author: string;
   date: string;
   readTime: string;
   category: string;
   image: string;
 }
 
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://m-pesa-shield-1.onrender.com/api/v1';
 
 const Blog = () => {
   const [posts, setPosts] = useState<BlogPost[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");
 
   useEffect(() => {
     const fetchPosts = async () => {
       try {
         const response = await fetch(`${API_BASE_URL}/blog/posts`);
         if (response.ok) {
           const data = await response.json();
           setPosts(data.data || []);
         }
       } catch (error) {
         console.error("Failed to fetch blog posts:", error);
       } finally {
         setIsLoading(false);
       }
     };
     fetchPosts();
   }, []);
 
   const filteredPosts = posts.filter(post =>
     post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
        <Header />
 
       {/* Hero */}
       <section className="pt-32 pb-12 px-4 bg-gradient-hero">
         <div className="container mx-auto text-center">
           <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
             Security Blog
           </h1>
           <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
             Stay informed about the latest fraud tactics, security tips, and platform updates.
           </p>
           <div className="max-w-md mx-auto relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
             <Input
               type="search"
               placeholder="Search articles..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10 bg-background"
             />
           </div>
         </div>
       </section>
 
       {/* Posts */}
       <section className="py-16 px-4">
         <div className="container mx-auto">
           {isLoading ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3].map((i) => (
                 <Card key={i} className="animate-pulse">
                   <div className="h-48 bg-muted rounded-t-lg" />
                   <CardContent className="p-6">
                     <div className="h-4 bg-muted rounded mb-2" />
                     <div className="h-4 bg-muted rounded w-3/4" />
                   </CardContent>
                 </Card>
               ))}
             </div>
           ) : filteredPosts.length > 0 ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPosts.map((post) => (
                 <Card key={post.id} className="group hover:shadow-xl transition-shadow overflow-hidden">
                   <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                     {post.image && (
                       <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                     )}
                     <div className="absolute top-3 left-3">
                       <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
                         {post.category}
                       </span>
                     </div>
                   </div>
                   <CardHeader>
                     <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                       {post.title}
                     </CardTitle>
                     <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                   </CardHeader>
                   <CardContent className="pt-0">
                     <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                       <span className="flex items-center gap-1">
                         <User className="w-4 h-4" />
                         {post.author}
                       </span>
                       <span className="flex items-center gap-1">
                         <Calendar className="w-4 h-4" />
                         {post.date}
                       </span>
                       <span className="flex items-center gap-1">
                         <Clock className="w-4 h-4" />
                         {post.readTime}
                       </span>
                     </div>
                     <Link to={`/blog/${post.id}`}>
                       <Button variant="ghost" className="p-0 h-auto text-primary">
                         Read More <ArrowRight className="w-4 h-4 ml-1" />
                       </Button>
                     </Link>
                   </CardContent>
                 </Card>
               ))}
             </div>
           ) : (
             <div className="text-center py-16">
               <p className="text-muted-foreground mb-4">No articles found</p>
               <p className="text-sm text-muted-foreground">Check back soon for new content!</p>
             </div>
           )}
         </div>
       </section>
 
       {/* Footer */}
       <footer className="py-8 px-4 border-t border-border">
         <div className="container mx-auto text-center">
           <p className="text-sm text-muted-foreground">
             © 2026 TrustGuardUnit. All rights reserved.
           </p>
         </div>
       </footer>
     </div>
   );
 };
 
 export default Blog;