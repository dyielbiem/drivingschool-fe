import { redirect } from "next/navigation";

const SectionID = ({ params }) => {
  redirect(`/admin/students/${params.sectionID}/all`);
};

export default SectionID;
