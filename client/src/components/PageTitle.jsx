import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PageTitle({ title }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center p-5 bg-secondary/90 sticky z-10 top-18 shadow backdrop-blur-lg">
      <button onClick={() => navigate(-1)} className="btn">
        <ArrowLeft className="rtl:rotate-180" />
      </button>
      <h3 dir="auto" className="w-fit text-xl font-bold">
        {title}
      </h3>
    </div>
  );
}

export default PageTitle;
