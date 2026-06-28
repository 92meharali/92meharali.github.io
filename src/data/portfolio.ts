export const profile = {
  name: "Mehar Ali",
  email: "92meharali@gmail.com",
  phone: "+92 321 8860329",
  location: "Lahore, Pakistan",
  github: "https://github.com/92meharali",
  linkedin: "https://www.linkedin.com/in/mehar-ali-90b974210/",
  photo: "/profile.jpg",
  cv: "/resume.pdf",
};

export const intro = {
  paragraphs: [
    "I'm Mehar Ali, a computer science undergraduate at Information Technology University in Lahore. Quantum computing is what pulls me in most: circuits, information theory, and where classical ML meets the Hilbert space. I also work on machine learning and AI safety, and outside of that I love astronomy, building things in the lab, and getting people excited about science.",
    "I'm Lab Lead at CAAISC (Center for the Advancement in AI and Spatial Computing), where I work with Dr. Ibrahim Ghaznavi on AI and VR research. I founded NEBULA, a scientific society that now connects more than 1,000 students across universities. I've published in Springer, IEEE, and CEUR-WS, including co-authored quantum neural network work under review at IEEE with Yildiz Technical University.",
    "In 2024, my team won the NASA Space Apps Challenge nationally and was nominated globally. I went on to help organize the hackathon in Lahore, first as local coordinator, then as co-lead and judge in 2025, when over 750 participants showed up. I also led the first IBM Qiskit Fall Fest in Pakistan, celebrating 100 years of quantum mechanics with hands-on workshops for 250+ students, and I run QCIT on YouTube, a series on quantum computing and information theory.",
    "I survived a brain hemorrhage when I was fifteen. That experience shaped how I think about neuroscience and medical research. I now contribute longitudinal data through the Apple Research app to support brain health studies.",
  ],
};

export const sections = [
  {
    id: "research",
    title: "Computer Science Research",
    paragraphs: [
      "My research spans quantum machine learning, explainable AI, inclusive VR design, and LLM safety evaluation. I'm co-author on quantum neural network work under review at IEEE (Yildiz Technical University) and have built hybrid quantum-classical models for intrusion detection. I first-authored a paper accepted at XAI-Ed 2026 (CEUR-WS) and co-authored work published in Springer LNCS through ICSLE 2025. I'm currently leading PERSONA, a framework for evaluating anthropomorphism and deception risk in frontier LLMs, and contributing to funded interdisciplinary projects with Qatar University's QRDI Council.",
      "At Turing, I evaluated alignment properties of GPT-4 and Gemini 2.5 through RLHF and SFT benchmarking. At CAAISC, I lead teams building ML pipelines: preprocessing, neural network experimentation, robustness testing, and statistical evaluation across concurrent AI and spatial computing projects.",
    ],
    subsections: [
      {
        title: "Selected Papers",
        items: [
          {
            label: "Explainable AI in Educational Systems",
            href: "https://www.xai-ed.net/papers/XAI-Ed_2026_paper_1.pdf",
            note: "XAI-Ed 2026 (CEUR-WS), 1st author, Accepted",
          },
          {
            label: "Barrier-Based Inclusive Design in VR: UDL 3.0 Framework",
            href: "https://www.researchgate.net/publication/395837132_Barrier-Based_Inclusive_Design_in_VR_Addressing_DEI_Challenges_through_the_UDL_30_Framework",
            note: "ICSLE 2025 (Springer LNCS), Co-author, Accepted",
          },
          {
            label: "PERSONA: Context-Aware LLM Anthropomorphism Evaluation",
            href: "https://github.com/92meharali/LLM_Benchmarking_for_Anthromorphism_Computation_for_AIES_paper",
            note: "Under review, 1st author",
          },
          {
            label: "Quantum Neural Networks for Wind Energy Forecasting",
            note: "IEEE, Under review, Co-author, Yildiz Technical University",
          },
          {
            label: "Digital Twins Scoping Review",
            note: "IEEE, Under review, Qatar University",
          },
        ],
      },
    ],
  },
  {
    id: "teaching",
    title: "Teaching & Coursework",
    paragraphs: [
      "Since January 2026, I've been a teaching assistant for Algorithms at ITU, supporting instruction, grading, and helping undergraduates with problem-solving and algorithmic reasoning.",
      "Earlier, I taught Python, Unity, and Scratch to kids at Seed Programming in Lahore. I also host conversations on AI through PAAI. On YouTube, my QCIT series (Quantum Computing & Information Theory) is where I spend the most teaching energy: walking through qubits, gates, and entanglement with intuition, inspired by Artur Ekert's lectures and the Oxford QIT textbooks. I learn by teaching; explaining quantum ideas out loud helps them stick.",
    ],
    subsections: [
      {
        title: "Selected Coursework",
        text: "Machine Learning, Data Science, Computer Vision, Algorithms, Databases, Software Engineering.",
      },
    ],
  },
  {
    id: "projects",
    title: "Machine Learning Projects",
    paragraphs: [
      "Most of my project work lives on GitHub. Quantum-classical hybrids and interpretable ML are the through-lines:",
    ],
    subsections: [
      {
        title: "Selected Work",
        items: [
          {
            label: "Hybrid Transformer VQC for NIDS",
            href: "https://github.com/92meharali/Hybrid_Transformer_VQC_NIDS",
            note: "Hybrid quantum-classical transformer with a variational quantum circuit for network intrusion detection.",
          },
          {
            label: "Stroke Detection with Grad-CAM & Quantization",
            href: "https://github.com/92meharali/stroke_detection_model_with_quantization",
            note: "CNN-based brain stroke detection at 93% accuracy; Grad-CAM interpretability and ~4× post-training compression.",
          },
          {
            label: "Network Intrusion Detection",
            href: "https://github.com/92meharali/Network_Intrusion_Detection",
            note: "End-to-end ML pipelines on NSL-KDD and CIC-IDS2017, 98.6% F1-score.",
          },
          {
            label: "Leukemia Detection via Graph ML",
            href: "https://github.com/92meharali/Lukemia_Detection_Using_GraphML",
            note: "Graph-based deep learning for AML vs. ALL classification, 94% test accuracy.",
          },
        ],
      },
    ],
  },
  {
    id: "experience",
    title: "Experience",
    paragraphs: [
      "Beyond research, I've worked across education, events, and industry. I was Lead Organizer for the IBM Quantum Qiskit Fall Fest 2025 in Pakistan, planning, coordinating, and running the country's first celebration of 100 years of quantum mechanics. I spent six months at Seed Programming as a research assistant teaching kids to code, interned at Virtuality Labs, and participated in a Copenhagen Business School study comparing VR metaverse classrooms to traditional and Zoom-based instruction.",
      "I also contribute to medical research through Apple's Research app, providing consistent longitudinal brain health data, motivated by my own experience recovering from a brain hemorrhage.",
    ],
    subsections: [
      {
        title: "Roles",
        items: [
          { label: "Lab Lead, CAAISC (ITU)", note: "2025 to Present, AI & VR research" },
          { label: "Teaching Assistant, Algorithms (ITU)", note: "2026 to Present" },
          { label: "Research Lead, CAAISC", note: "2025 to Present, Lahore" },
          { label: "Founder & President, NEBULA", note: "2024 to Present" },
          { label: "Lead Organizer, IBM Qiskit Fall Fest Pakistan", note: "Aug to Nov 2025" },
          { label: "Co-Lead & Judge, NASA Space Apps Lahore", note: "Sep to Oct 2025, 750+ participants" },
          { label: "Undergraduate Research Assistant, NUST", note: "Jul to Aug 2025" },
          { label: "Research Participant, Apple Research", note: "Mar to Jun 2025, Brain health studies" },
          { label: "Content Creator, YouTube (QCIT series)", note: "Jul to Oct 2025, Quantum computing lectures" },
          { label: "Local Coordinator, NASA Space Apps Lahore", note: "Sep to Oct 2024" },
          { label: "Research Assistant, Seed Programming", note: "Feb to Aug 2024, Python, Unity, Scratch" },
          { label: "AI Model Evaluator, Turing", note: "Remote, GPT-4 & Gemini 2.5 evaluation" },
        ],
      },
    ],
  },
  {
    id: "nebula",
    title: "NEBULA & Community",
    paragraphs: [
      "I founded NEBULA in 2024 to build an interdisciplinary scientific community in Pakistan. What started as a student society now connects more than 1,000 people across universities, running hackathons, public moon-sighting events, and hands-on science projects.",
      "One of those projects was attempting to build one of the world's lowest-cost Farnsworth fusor reactors, exploring vacuum systems, high-voltage engineering, and plasma physics, and documenting everything along the way. I also published NEBULA Magazine, available on Amazon Kindle.",
    ],
    subsections: [
      {
        title: "Links",
        items: [
          {
            label: "NEBULA on Instagram",
            href: "https://www.instagram.com/nebula_headquarters",
          },
          {
            label: "NASA Space Apps 2024, Nebula Galaxar (National Winner)",
            href: "https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/nebula-galaxar/?tab=details",
          },
          {
            label: "IBM Qiskit Fall Fest 2025, Event Website",
            href: "https://ibm-qiskit-fall-fest2025.vercel.app/",
          },
          {
            label: "NEBULA Magazine on Amazon",
            href: "https://www.amazon.com/Archives-2-NEBULA-Mehar-Ali-ebook/dp/B0DVLS5161",
          },
          {
            label: "CAAISC Team Page",
            href: "https://caaisc.itu.edu.pk/team",
          },
        ],
      },
    ],
  },
  {
    id: "honors",
    title: "Honors & Recognition",
    paragraphs: [],
    subsections: [
      {
        title: "",
        items: [
          {
            label: "AIC Pakistan 2026, National Winner",
            href: "https://www.linkedin.com/posts/information-technology-university_activity-7440108338027065344-qhc0",
            note: "Selected for international finals in France (CNES & ESA)",
          },
          {
            label: "NASA Space Apps Challenge 2024, National Winner & Global Nominee",
            href: "https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/nebula-galaxar/?tab=details",
          },
          {
            label: "Innovative Pakistan 2026, Runner-up",
            href: "https://www.linkedin.com/feed/update/urn:li:activity:7470778147882569728/",
            note: "Among 1,000+ projects and 8,000+ participants",
          },
          {
            label: "QRDI Council, Qatar, Research Contributor",
            href: "https://www.linkedin.com/feed/update/urn:li:activity:7424050684309917696/",
            note: "$300,000 funded neuroscience & AI initiative",
          },
          {
            label: "g.tec BCI & Neurotechnology Spring School",
            note: "130 hours of advanced BCI and neurotechnology training",
          },
          {
            label: "IBM Qiskit Fall Fest, Credly Badge",
            href: "https://www.credly.com/badges/14eefc17-88e5-4e48-b0e8-ecb932ab0d6b/public_url",
          },
        ],
      },
    ],
  },
  {
    id: "outside",
    title: "Outside the Lab",
    paragraphs: [
      "I love discussing astronomy and quantum physics, the kind of conversations that start at midnight and don't end until someone pulls up a paper. I was featured on Express News, 24 News, PTV, and the ITU Podcast talking about science outreach and student-led research in Pakistan.",
      "When I'm not in a lab or behind a notebook, I'm usually organizing something, teaching something, or trying to explain a quantum circuit to a camera.",
    ],
    subsections: [
      {
        title: "Media",
        items: [
          { label: "Express News", href: "https://www.instagram.com/reel/DDPYqbKqwj1/" },
          { label: "24 News", href: "https://www.instagram.com/reel/DDM2wrHKapq/" },
          { label: "PTV", href: "https://www.instagram.com/reel/DIgQsOLKF_b/" },
          { label: "ITU Podcast", href: "https://www.instagram.com/reel/DHdmzG6KDvw/" },
        ],
      },
    ],
  },
];

export const footerLinks = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "CV (PDF)", href: profile.cv },
];
