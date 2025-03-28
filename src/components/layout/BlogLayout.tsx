import { format } from 'date-fns'

interface BlogLayoutProps {
  title: string
  date: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
  children: React.ReactNode
}

export default function BlogLayout({ title, date, author, tags, children }: BlogLayoutProps) {
  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="mt-4 flex items-center gap-4">
          <img
            src={author.avatar}
            alt={author.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="text-gray-900 font-medium">{author.name}</p>
            <p className="text-gray-500">{format(new Date(date), 'PPP')}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
    </article>
  )
} 