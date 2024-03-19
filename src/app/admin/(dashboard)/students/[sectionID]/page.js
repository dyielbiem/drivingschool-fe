import { redirect } from "next/navigation";

const SectionID = ({ params }) => {
  redirect(`/admin/students/${params.sectionID}/all?page=1`);
};

export default SectionID;
