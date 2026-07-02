export interface Contributor {
    name: string;
    role: 'Director' | 'Assistant Director' | 'Deputy Executive' | 'Senior Sub Executive' | 'Sub Executive';
    email: string;
    linkedin?: string;
    facebook?: string;
    github?: string;
    profileImage: string;
}

export const contributorsData: Contributor[] = [
    // 1. Director
    {
        name: "Saobia Islam Tinni",
        role: "Director",
        email: "islamsaobia@gmail.com",
        linkedin: "https://www.linkedin.com/in/saobia-islam/",
        facebook: "https://www.facebook.com/saobia.tinni",
        github: "https://github.com/Saobia3i",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/Saobia%20Islam%20-%20Saobia%20Islam%20(Tinni).png",
    },
    // 2. Assistant Director
    {
        name: "Shajedul Kabir Rafi",
        role: "Assistant Director",
        email: "shajidulkabir12345@gmail.com",
        linkedin: "https://www.linkedin.com/in/shajedul-kabir-rafi-4489122b2?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        facebook: "https://www.facebook.com/share/1CKjtczWe5/",
        github: "https://github.com/Rafi12234",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/Picsart_24-01-20_21-35-16-132%20-%20Shajedul%20Kabir%20Rafi.jpg",
    },
    {
        name: "Arany Hasan",
        role: "Assistant Director",
        email: "arany.cse.20220204053@aust.edu",
        linkedin: "https://www.linkedin.com/in/arany-hasan-79b910338?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        facebook: "https://www.facebook.com/share/1D9x1Cq6gF/",
        github: "https://github.com/arany677",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/inbound3652054682004803366%20-%20Arany%20Hasan.webp",
    },
    // 3. Deputy Executive
    {
        name: "Samanta Islam",
        role: "Deputy Executive",
        email: "samanta.cse.20230104082@aust.edu",
        linkedin: "https://www.linkedin.com/in/samanta-islam-449bb33b0/",
        facebook: "https://www.facebook.com/samanta.islam.750331",
        github: "https://github.com/Samanta503",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/656926061_1495299585547737_5569748470602261528_n%20-%20Samanta%20Islam.jpg",
    },
    {
        name: "Rehnuma Tarannum Ramisha",
        role: "Deputy Executive",
        email: "rehnumatarannum486@gmail.com",
        linkedin: "https://www.linkedin.com/in/rehnuma-tarannum-694993285/",
        facebook: "https://www.facebook.com/rehnuma.ramisha",
        github: "https://github.com/rehnuma267",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/inbound1373035014902896239%20-%20Rehnuma%20Tarannum%20Ramisha.jpg",
    },
    {
        name: "Asif Iqbal Limon",
        role: "Deputy Executive",
        email: "limonasif90@gmail.com",
        facebook: "https://m.facebook.com/Asiflimon17/",
        github: "https://github.com/neoFlare19",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/IMG-20250330-WA0000%20-%20Asif%20Limon.jpg",
    },
    // 4. Senior Sub Executive
    {
        name: "Farhana Rahman",
        role: "Senior Sub Executive",
        email: "farhanarahman7361@gmail.com",
        linkedin: "www.linkedin.com/in/farhana-rahman-06071b405",
        facebook: "https://www.facebook.com/share/19D81Jdg6b/",
        github: "https://github.com/Farhana7361",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/inbound5827818081355706330%20-%20FARHANA%20RAHMAN.jpg",
    },
    {
        name: "Mohammad Obaidul Ekram Riad",
        role: "Senior Sub Executive",
        email: "riadekram410@gmail.com",
        linkedin: "https://www.linkedin.com/in/riadekram410",
        facebook: "https://www.facebook.com/share/1BYRbBWa8d/?mibextid=wwXIfr",
        github: "https://github.com/riadekram410",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/IMG_0455%20-%20MOHAMMAD%20OBAIDUL%20EKRAM%20RIAD.jpeg",
    },
    {
        name: "Saidul Islam Shehab",
        role: "Senior Sub Executive",
        email: "saidulislamshehab@gmail.com",
        facebook: "https://www.facebook.com/saidul.islam.shehab.me/",
        github: "https://github.com/saidulislamshehab",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/IMG_20250511_151829%20-%20SAIDUL%20ISLAM%20SHEHAB.jpg",
    },
    {
        name: "Fahmid Siddique Ahmed",
        role: "Senior Sub Executive",
        email: "fahmidsiddiqueahmed@gmail.com",
        linkedin: "linkedin.com/in/fahmid-siddique-83201b",
        github: "github.com/itsFahmid",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/Fahmid_Siddique_CSE_3.2%20-%20Fahmid%20Siddique%20Ahmed.jpg",
    },
    // 5. Sub Executive
    {
        name: "Rohan Rahim",
        role: "Sub Executive",
        email: "rohanrahim024@gmail.com",
        linkedin: "https://www.linkedin.com/in/rohan-rahim-767326237/",
        facebook: "https://www.facebook.com/rohan.rahim.90",
        github: "https://github.com/rohan9932",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/07012023_184300.Helena%20Atik%20true%20DSLR.PORTRAIT.jpg%20-%20Rohan%20Rahim.jpeg",
    },
    {
        name: "Nushrat Yeasmin Nahin",
        role: "Sub Executive",
        email: "nushrat.cse.20230104003@aust.edu",
        linkedin: "https://www.linkedin.com/in/nushrat-nahin-8b5b66414",
        facebook: "https://www.facebook.com/share/1Eq4tXnJgL/?mibextid=wwXIfr",
        github: "nushratnahin",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/IMG_9258%20-%20Nushrat%20Yeasmin%20Nahin.jpeg",
    },
    {
        name: "Sirajus Salikin",
        role: "Sub Executive",
        email: "ssirajussalikin98@gmail.com",
        facebook: "https://www.facebook.com/sirajussalikin.siddique/",
        github: "https://github.com/ssirajussalikin119",
        profileImage: "https://ik.imagekit.io/mekt2pafz/Robomania%202.0%20highlights/arcContributors/WhatsApp%20Image%202026-07-02%20at%2010.33.39%20PM.jpeg",
    },
];
