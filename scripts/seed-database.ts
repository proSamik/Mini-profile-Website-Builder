import 'dotenv/config';
import { nanoid } from 'nanoid';
import { db } from '../src/lib/db/client';
import { profiles, users } from '../src/lib/db/schema';
import { hashPassword } from '../src/lib/auth/password';
import { ProfileData, ProfileLayout, ProfileTheme } from '../src/types/profile';

const PASSWORD = 'NextHash#2025';

const seedData = [
  {
    username: 'sarahchen',
    displayName: 'Sarah Chen',
    bio: 'Full-stack developer passionate about building beautiful web experiences. Love React, TypeScript, and design systems.',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'GitHub', url: 'https://github.com/sarahchen', icon: 'github' },
      { label: 'Twitter', url: 'https://twitter.com/sarahchen', icon: 'twitter' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/sarahchen', icon: 'linkedin' },
      { label: 'Portfolio', url: 'https://sarahchen.dev', icon: 'globe' },
    ],
    highlights: [
      {
        title: 'E-Commerce Platform',
        description: 'Built a modern e-commerce platform with React and Node.js. Features include real-time inventory, payment integration, and admin dashboard.',
        images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'],
        url: 'https://github.com/sarahchen/ecommerce-platform',
        category: 'project',
      },
      {
        title: 'Design System Library',
        description: 'Created a comprehensive design system with 50+ reusable components. Used by 10+ teams across the company.',
        images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'],
        url: 'https://github.com/sarahchen/design-system',
        category: 'project',
      },
      {
        title: 'Tech Conference Speaker',
        description: 'Spoke at ReactConf 2024 about building scalable component libraries. Reached 500+ developers.',
        images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'],
        url: 'https://reactconf.com/speakers/sarah-chen',
        category: 'achievement',
      },
    ],
    theme: { packId: 'ocean', mode: 'light' },
    layout: 'default',
  },
  {
    username: 'marcusjones',
    displayName: 'Marcus Jones',
    bio: 'Product designer and creative director. I turn complex problems into simple, beautiful solutions.',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'Dribbble', url: 'https://dribbble.com/marcusjones', icon: 'dribbble' },
      { label: 'Behance', url: 'https://behance.net/marcusjones', icon: 'behance' },
      { label: 'Instagram', url: 'https://instagram.com/marcusjones', icon: 'instagram' },
      { label: 'Portfolio', url: 'https://marcusjones.design', icon: 'globe' },
    ],
    highlights: [
      {
        title: 'Brand Identity for Startup',
        description: 'Designed complete brand identity including logo, color palette, typography, and marketing materials.',
        images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'],
        url: 'https://behance.net/gallery/startup-branding',
        category: 'project',
      },
      {
        title: 'Mobile App UI Design',
        description: 'Created intuitive mobile app interface for fintech startup. Increased user engagement by 40%.',
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop'],
        url: 'https://dribbble.com/shots/mobile-app-ui',
        category: 'project',
      },
    ],
    theme: { packId: 'sunset', mode: 'light' },
    layout: 'layout1',
  },
  {
    username: 'priyapatel',
    displayName: 'Priya Patel',
    bio: 'Data scientist and ML engineer. Exploring the intersection of AI and healthcare. Open source contributor.',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'GitHub', url: 'https://github.com/priyapatel', icon: 'github' },
      { label: 'Twitter', url: 'https://twitter.com/priyapatel', icon: 'twitter' },
      { label: 'Medium', url: 'https://medium.com/@priyapatel', icon: 'medium' },
      { label: 'Kaggle', url: 'https://kaggle.com/priyapatel', icon: 'kaggle' },
    ],
    highlights: [
      {
        title: 'Medical Image Analysis AI',
        description: 'Developed deep learning model for early detection of diseases. Achieved 95% accuracy on test dataset.',
        images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'],
        url: 'https://github.com/priyapatel/medical-ai',
        category: 'project',
      },
      {
        title: 'Published Research Paper',
        description: 'Co-authored paper on "Machine Learning Applications in Healthcare" published in Nature Medicine.',
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'],
        url: 'https://nature.com/articles/ml-healthcare',
        category: 'achievement',
      },
    ],
    theme: { packId: 'lavender', mode: 'dark' },
    layout: 'layout2',
  },
  {
    username: 'alexrivera',
    displayName: 'Alex Rivera',
    bio: 'Content creator and video producer. Making tech accessible through storytelling and visual content.',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'YouTube', url: 'https://youtube.com/@alexrivera', icon: 'youtube' },
      { label: 'Instagram', url: 'https://instagram.com/alexrivera', icon: 'instagram' },
      { label: 'TikTok', url: 'https://tiktok.com/@alexrivera', icon: 'tiktok' },
      { label: 'Website', url: 'https://alexrivera.com', icon: 'globe' },
    ],
    highlights: [
      {
        title: 'Tech Tutorial Series',
        description: 'Created 50+ video tutorials on web development. Reached 100K+ subscribers and 5M+ views.',
        images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'],
        url: 'https://youtube.com/playlist/web-dev-tutorials',
        category: 'project',
      },
      {
        title: 'Documentary: The Future of AI',
        description: 'Produced and directed a 30-minute documentary exploring AI impact on society. Featured at film festivals.',
        images: ['https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop'],
        url: 'https://alexrivera.com/documentary-ai',
        category: 'project',
      },
    ],
    theme: { packId: 'midnight', mode: 'dark' },
    layout: 'layout3',
  },
  {
    username: 'emilywatson',
    displayName: 'Emily Watson',
    bio: 'UX researcher and accessibility advocate. Making digital products inclusive for everyone.',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/emilywatson', icon: 'linkedin' },
      { label: 'Twitter', url: 'https://twitter.com/emilywatson', icon: 'twitter' },
      { label: 'Blog', url: 'https://emilywatson.blog', icon: 'globe' },
    ],
    highlights: [
      {
        title: 'Accessibility Audit Tool',
        description: 'Built automated tool for testing web accessibility. Used by 200+ companies to improve their sites.',
        images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'],
        url: 'https://github.com/emilywatson/accessibility-tool',
        category: 'project',
      },
      {
        title: 'WCAG Compliance Guide',
        description: 'Authored comprehensive guide to WCAG 2.1 compliance. Downloaded 10K+ times by developers worldwide.',
        images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'],
        url: 'https://emilywatson.blog/wcag-guide',
        category: 'achievement',
      },
    ],
    theme: { packId: 'forest', mode: 'light' },
    layout: 'layout4',
  },
  {
    username: 'davidkim',
    displayName: 'David Kim',
    bio: 'Backend engineer specializing in distributed systems and cloud infrastructure. AWS certified architect.',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'GitHub', url: 'https://github.com/davidkim', icon: 'github' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/davidkim', icon: 'linkedin' },
      { label: 'Twitter', url: 'https://twitter.com/davidkim', icon: 'twitter' },
    ],
    highlights: [
      {
        title: 'Microservices Architecture',
        description: 'Designed and implemented microservices architecture handling 1M+ requests per day. Reduced latency by 60%.',
        images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop'],
        url: 'https://github.com/davidkim/microservices-arch',
        category: 'project',
      },
      {
        title: 'Open Source Contributor',
        description: 'Maintained popular open source project with 5K+ stars. Fixed 100+ bugs and added major features.',
        images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'],
        url: 'https://github.com/davidkim/oss-project',
        category: 'achievement',
      },
    ],
    theme: { packId: 'candy', mode: 'light' },
    layout: 'default',
  },
  {
    username: 'oliviamartinez',
    displayName: 'Olivia Martinez',
    bio: 'Marketing strategist and growth hacker. Helping startups scale from 0 to 1M users.',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/oliviamartinez', icon: 'linkedin' },
      { label: 'Twitter', url: 'https://twitter.com/oliviamartinez', icon: 'twitter' },
      { label: 'Newsletter', url: 'https://oliviamartinez.substack.com', icon: 'mail' },
    ],
    highlights: [
      {
        title: 'Growth Playbook',
        description: 'Created comprehensive growth playbook used by 50+ startups. Generated $10M+ in revenue for clients.',
        images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'],
        url: 'https://oliviamartinez.substack.com/growth-playbook',
        category: 'project',
      },
      {
        title: 'Marketing Conference Keynote',
        description: 'Delivered keynote at GrowthCon 2024 on "Scaling Without Burning Cash". 2K+ attendees.',
        images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'],
        url: 'https://growthcon.com/speakers/olivia-martinez',
        category: 'achievement',
      },
    ],
    theme: { packId: 'monochrome', mode: 'dark' },
    layout: 'layout1',
  },
  {
    username: 'jameswilson',
    displayName: 'James Wilson',
    bio: 'Mobile app developer and iOS specialist. Building apps that millions of people use every day.',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'GitHub', url: 'https://github.com/jameswilson', icon: 'github' },
      { label: 'App Store', url: 'https://apps.apple.com/developer/jameswilson', icon: 'app-store' },
      { label: 'Twitter', url: 'https://twitter.com/jameswilson', icon: 'twitter' },
    ],
    highlights: [
      {
        title: 'Fitness Tracking App',
        description: 'Built iOS app with 500K+ downloads. Featured in App Store "Apps We Love" section.',
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop'],
        url: 'https://apps.apple.com/app/fitness-tracker',
        category: 'project',
      },
      {
        title: 'SwiftUI Framework Contributor',
        description: 'Contributed to open source SwiftUI components library. Used by 1K+ developers.',
        images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'],
        url: 'https://github.com/jameswilson/swiftui-components',
        category: 'project',
      },
    ],
    theme: { packId: 'ocean', mode: 'dark' },
    layout: 'layout2',
  },
  {
    username: 'sophiaanderson',
    displayName: 'Sophia Anderson',
    bio: 'DevOps engineer and cloud architect. Automating infrastructure and improving developer experience.',
    profilePhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'GitHub', url: 'https://github.com/sophiaanderson', icon: 'github' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/sophiaanderson', icon: 'linkedin' },
      { label: 'Blog', url: 'https://sophiaanderson.dev', icon: 'globe' },
    ],
    highlights: [
      {
        title: 'CI/CD Pipeline Automation',
        description: 'Built automated CI/CD pipeline reducing deployment time from 2 hours to 5 minutes. Used by entire engineering team.',
        images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop'],
        url: 'https://github.com/sophiaanderson/cicd-pipeline',
        category: 'project',
      },
      {
        title: 'Kubernetes Best Practices Guide',
        description: 'Wrote comprehensive guide on Kubernetes best practices. Featured in DevOps Weekly newsletter.',
        images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'],
        url: 'https://sophiaanderson.dev/k8s-guide',
        category: 'achievement',
      },
    ],
    theme: { packId: 'sunset', mode: 'dark' },
    layout: 'layout3',
  },
  {
    username: 'michaelbrown',
    displayName: 'Michael Brown',
    bio: 'Entrepreneur and startup founder. Building the future of remote work and collaboration tools.',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/michaelbrown', icon: 'linkedin' },
      { label: 'Twitter', url: 'https://twitter.com/michaelbrown', icon: 'twitter' },
      { label: 'Company', url: 'https://remotework.io', icon: 'globe' },
    ],
    highlights: [
      {
        title: 'Remote Work Platform',
        description: 'Founded SaaS platform for remote teams. Grew to 10K+ users and $2M ARR in first year.',
        images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'],
        url: 'https://remotework.io',
        category: 'project',
      },
      {
        title: 'Series A Funding',
        description: 'Raised $5M Series A funding from top-tier VCs. Featured in TechCrunch and Forbes.',
        images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'],
        url: 'https://techcrunch.com/remotework-funding',
        category: 'achievement',
      },
    ],
    theme: { packId: 'lavender', mode: 'light' },
    layout: 'layout4',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    const passwordHash = await hashPassword(PASSWORD);

    for (const data of seedData) {
      // Create user
      const userId = nanoid();
      await db.insert(users).values({
        id: userId,
        username: data.username,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create profile data
      const profileData: ProfileData = {
        username: data.username,
        displayName: data.displayName,
        bio: data.bio,
        profilePhoto: {
          type: 'url',
          value: data.profilePhoto,
        },
        links: data.links.map((link, index) => ({
          id: nanoid(),
          label: link.label,
          url: link.url,
          icon: link.icon,
          displayOrder: index,
        })),
        highlights: data.highlights.map((highlight, index) => ({
          id: nanoid(),
          title: highlight.title,
          description: highlight.description,
          images: highlight.images,
          url: highlight.url,
          displayOrder: index,
          category: highlight.category,
        })),
        layout: data.layout as ProfileLayout,
        theme: data.theme as ProfileTheme,
      };

      // Create profile
      await db.insert(profiles).values({
        id: nanoid(),
        userId,
        username: data.username,
        profileData: profileData as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✓ Created profile for ${data.displayName} (@${data.username})`);
    }

    console.log(`\n✅ Successfully seeded ${seedData.length} profiles!`);
    console.log(`\n📝 All accounts use password: ${PASSWORD}`);
    console.log('\n🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
