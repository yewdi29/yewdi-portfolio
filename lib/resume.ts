export type ResumeRole = {
  start: string;
  end: string;
  title: string;
  org: string;
  place: string;
};

export const resume = {
  email: "yewdielv10@gmail.com",
  linkedin: "https://www.linkedin.com/in/yewdi/",
  experience: [
    {
      start: "Apr 2025",
      end: "Present",
      title: "Brand & Design Engineer",
      org: "Independent",
      place: "Austin, TX",
    },
    {
      start: "Jan 2024",
      end: "Apr 2025",
      title: "Lead Visual Designer",
      org: "My Vida Origins / My Vida Skin",
      place: "Remote",
    },
    {
      start: "Feb 2022",
      end: "Dec 2024",
      title: "Digital & Social Designer",
      org: "My Vida Origins",
      place: "Remote",
    },
    {
      start: "Oct 2021",
      end: "Feb 2022",
      title: "Packaging Designer",
      org: "My Vida Origins",
      place: "Remote",
    },
    {
      start: "May 2019",
      end: "Sep 2021",
      title: "Marketing & Brand Coordinator",
      org: "Black Diamond Drilling",
      place: "Odessa, TX",
    },
    {
      start: "Jan 2018",
      end: "May 2019",
      title: "Web Developer & Designer",
      org: "Black Diamond Drilling",
      place: "Odessa, TX",
    },
  ] satisfies ResumeRole[],
  education: [
    {
      start: "2014",
      end: "2017",
      title: "B.S. Computer Science",
      org: "University of Texas P.B.",
      place: "Odessa, TX",
    },
    {
      start: "2014",
      end: "2014",
      title: "Illustrator & Photoshop Certificate",
      org: "Adobe",
      place: "",
    },
  ] satisfies ResumeRole[],
};
