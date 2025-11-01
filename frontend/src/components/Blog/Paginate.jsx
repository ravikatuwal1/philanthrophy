import BlogList from '../components/Blog/BlogList';

export default function BlogPage() {
  return <BlogList paginate pageSize={10} title="Articles" />;
}