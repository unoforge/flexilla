export const users: {
    id: string;
    avatar: string;
    user_name: string;
    profile_link: string;
    description:string;
    team:{
      name:string,
      link:string,
    },
    mail: string;
    type: "public" | "private";
    role: "member" | "admin" | "owner" | "collaborator";
  }[] = [
    {
      id: "us1",
      avatar: "/demo-images/johnkat.webp",
      user_name: "Johnkat MJ",
      profile_link: "https://github.com/Johnkat-Mj",
      description:"💻 building amazing webdesign stuff 🚧 working on @unify-ui-dev ✨ interested in : web development, react/nextjs, tailwindcss, VueJs, UnoCss... C# lover",
      team:{
        name:"UnifyUI Dev",
        link:"https://github.com/unoforge",
      },
      mail: "johnkatembue4@gmail.com",
      type: "public",
      role: "admin",
    },
    {
      id: "us2",
      avatar: "/demo-images/tresorKasenda.webp",
      user_name: "Tresor Kasenda",
      profile_link: "string",
      description:"Software Developer| Php Developer | Laravel Developer| Inertia | ReactJs | Angular | VueJs | Python",
      team:{
        name:"UnifyUI Dev",
        link:"https://github.com/unoforge",
      },
      mail: "tresorKasenda",
      type: "private",
      role: "owner",
    },
    {
      id: "us3",
      avatar: "/demo-images/tresorIlunga.webp",
      user_name: "Tresor Ilunga",
      profile_link: "https://github.com/Tresor-ilunga",
      description:"Web Developer at Devscast Community : @devscast",
      team:{
        name:"Devscast Tech",
        link:"https://github.com/devscast",
      },
      mail: "ilungat82@gmail.com",
      type: "private",
      role: "collaborator",
    },
    {
      id: "us4",
      avatar: "/demo-images/fincth.webp",
      user_name: "Judel Fintch",
      profile_link: "https://github.com/judelFintch",
      description:"Je suis un passionné de développement web avec une solide expérience dans la création de sites et d'applications web conviviaux et performants.",
      team:{
        name:"UnifyUI Dev",
        link:"https://github.com/unoforge",
      },
      mail: "judelFintch",
      type: "private",
      role: "member",
    },
  ];