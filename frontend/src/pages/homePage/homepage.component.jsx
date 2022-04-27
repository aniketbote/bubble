import './homepage.style.css';
import SearchBar from '../../components/search/search.component';
import QuestionCard from '../../components/questionCard/questionCard.component';
import BlogCard from '../../components/blogCard/blogCard.component';
const HomePage = () => {
    return (
    <div >
    <SearchBar/>
    <h3 style={{margin:'15px'}}>Top Questions and Blogs</h3>
    <QuestionCard/>
    <BlogCard/>
    <QuestionCard/>
    <QuestionCard/>
    <BlogCard/>
    <QuestionCard/>
    <QuestionCard/>
    <BlogCard/>
    <QuestionCard/>
    <BlogCard/>
    <BlogCard/>
    <BlogCard/>
    <QuestionCard/>
    <BlogCard/>
    <QuestionCard/>
    <QuestionCard/>
    <QuestionCard/>
    <QuestionCard/>
    </div>
    );
}

export default HomePage;
