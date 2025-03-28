import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Card } from '@/components/ui/card'
import { Element } from "react-scroll";
import Link from 'next/link'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { Metadata } from 'next'
import Header from '@/components/sections/Header';

export const metadata: Metadata = {
  title: 'Blog Posts | Endustry',
  description: 'Read the latest insights and updates about industrial automation and manufacturing',
}

interface Blog {
  title: string
  description: string
  date: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
  image: string
  slug: string
}

// This function runs at build time
async function getBlogs(): Promise<Blog[]> {
  const blogsDirectory = path.join(process.cwd(), 'blogs')
  
  try {
    const files = fs.readdirSync(blogsDirectory)
    
    const blogs = files
      .filter(filename => filename.endsWith('.mdx'))
      .map((filename) => {
        const filePath = path.join(blogsDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(fileContents)
        
        return {
          ...(data as Omit<Blog, 'slug'>),
          slug: filename.replace('.mdx', ''),
        }
      })

    return blogs.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  } catch (error) {
    console.error('Error reading blog files:', error)
    return []
  }
}

// Generate static pages at build time
export async function generateStaticParams() {
  const blogs = await getBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export default async function BlogsPage() {
  const blogs = await getBlogs()

  return (
    <section>
        <div className="container mt-32">
        <Header />
        <div className='p-4'>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-semibold text-p4">Blog Posts</h1>
          <p className="mt-4 text-xs text-p5">
            Latest insights about industrial automation and manufacturing
          </p>
        </div>
        {/* Only show New Post button for authenticated users */}
        {/* <AuthNewPostButton /> */}
      </div>
        
      {blogs.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-gray-500">No blog posts found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      )}
      </div>
    </div>
    </section>
  )
}

// Separate component for the New Post button that checks authentication
// function AuthNewPostButton() {
//   const { data: session } = useSession()

//   if (!session) return null

//   return (
//     <Link
//       href="/blogs/new"
//       className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//     >
//       <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
//       New Post
//     </Link>
//   )
// }

// Separate component for blog cards
function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg border-2 border-r border-s3 bg-s3/50">
      {blog.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transform transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-p4">
            <Link href={`/blogs/${blog.slug}`} className="hover:text-indigo-600 transition-colors">
              {blog.title}
            </Link>
          </h2>
          <time className="mt-1 text-sm text-gray-400">
            {format(new Date(blog.date), 'PPP')}
          </time>
        </div>
        
        <p className="text-p5 line-clamp-3">{blog.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm text-gray-400">{blog.author.name}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-200 text-indigo-900"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}