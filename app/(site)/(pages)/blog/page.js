import NewsBlog from "@/app/components/blog/ourBlog";
import Banner from "@/app/components/common/banner";
import Contact from "@/app/components/common/contact";
import OurClients from "@/app/components/common/out-clients";

const Blog = () => {
    return (
        <div>
          <Banner title={"News & Blog"}/>
          <NewsBlog/>
          <OurClients/>
          <Contact/>
        </div>
    );
};

export default Blog;