import React from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { useSecretariats } from '../../features/secretariats/hooks/useSecretariats';
import './Secretariats.css';

// Static secretariat data structure
const secretariatsData = [
    {
        id: 1,
        nameKey: 'media',
        name: 'Media Secretariat',
        nameAr: 'أمانة الإعلام',
        description: 'The Secretariat dedicated to highlighting the identity of the Association and conveying its activities and initiatives in a creative manner. It reflects the true image of the student environment and contributes to building effective communication with the university community and the external surroundings.',
        descriptionAr: 'الأمانة المخصصة لإبراز هوية الاتحاد ونقل أنشطته ومبادراته بأسلوب إبداعي. تعكس الصورة الحقيقية للبيئة الطلابية وتساهم في بناء تواصل فعال مع المجتمع الجامعي والمحيط الخارجي.',
        offices: [
            {
                name: 'Administration and Strategic Planning Office',
                nameAr: 'مكتب الإدارة والتخطيط الاستراتيجي',
                subtitle: 'The Organizational Mind of the Secretariat.',
                subtitleAr: 'العقل التنظيمي للأمانة.',
                description: 'It organizes work between offices, ensures the harmony of efforts towards unified goals, sets the media plan, and monitors its execution to ensure professionalism and efficiency.',
                descriptionAr: 'ينظم العمل بين المكاتب، ويضمن تناغم الجهود نحو أهداف موحدة، ويضع الخطة الإعلامية، ويراقب تنفيذها لضمان الاحترافية والكفاءة.'
            },
            {
                name: 'Design Office',
                nameAr: 'مكتب التصميم',
                subtitle: '',
                subtitleAr: '',
                description: 'Translates ideas into creative visual designs that reflect the Association\'s identity and pass on its messages in an attractive style. It supports media campaigns and manages the visual voice.',
                descriptionAr: 'يترجم الأفكار إلى تصميمات بصرية إبداعية تعكس هوية الاتحاد وتنقل رسائله بأسلوب جذاب. يدعم الحملات الإعلامية ويدير الصوت البصري.'
            },
            {
                name: 'Montage (Video Editing) Office',
                nameAr: 'مكتب المونتاج (تحرير الفيديو)',
                subtitle: '',
                subtitleAr: '',
                description: 'Produces professional visual content, including videos and motion graphics, showing activities and projects in a dynamic and interesting style that reflects the details of the university experience from a distinct perspective.',
                descriptionAr: 'ينتج محتوى بصري احترافي، بما في ذلك مقاطع الفيديو والرسوم المتحركة، ويعرض الأنشطة والمشاريع بأسلوب ديناميكي ومثير يعكس تفاصيل التجربة الجامعية من منظور مميز.'
            },
            {
                name: 'Content Writing Office',
                nameAr: 'مكتب كتابة المحتوى',
                subtitle: '',
                subtitleAr: '',
                description: 'Weaves words that express the identity of the college and its mission. It prepares influential media texts presented through posts, videos, and reports in a clear, attractive, and convincing style.',
                descriptionAr: 'ينسج الكلمات التي تعبر عن هوية الكلية ورسالتها. يعد نصوصاً إعلامية مؤثرة تُقدم عبر المنشورات والفيديوهات والتقارير بأسلوب واضح وجذاب ومقنع.'
            },
            {
                name: 'Documentation Office',
                nameAr: 'مكتب التوثيق',
                subtitle: '',
                subtitleAr: '',
                description: 'Documents the moment with a professional lens and captures scenes of university life in all its details to produce honest visual content that immortalizes activities and events, providing a rich media archive.',
                descriptionAr: 'يوثق اللحظة بعدسة احترافية ويلتقط مشاهد الحياة الجامعية بكل تفاصيلها لإنتاج محتوى بصري صادق يخلد الأنشطة والفعاليات، ويوفر أرشيفاً إعلامياً غنياً.'
            }
        ]
    },
    {
        id: 2,
        nameKey: 'academic',
        name: 'Academic Secretariat',
        nameAr: 'الأمانة الأكاديمية',
        description: 'Represents the body concerned with following up on the academic affairs of the college students to ensure the smooth flow of their educational path. It also seeks to develop the scientific and skill-based aspects of their personalities, contributing to refining their capabilities and enabling them to achieve university and professional excellence.',
        descriptionAr: 'تمثل الجهة المعنية بمتابعة الشؤون الأكاديمية لطلاب الكلية لضمان سلاسة مسارهم التعليمي. كما تسعى لتطوير الجوانب العلمية والمهارية لشخصياتهم، مما يساهم في صقل قدراتهم وتمكينهم من تحقيق التميز الجامعي والمهني.',
        offices: [
            {
                name: 'Academic Development Office',
                nameAr: 'مكتب التطوير الأكاديمي',
                subtitle: '',
                subtitleAr: '',
                description: 'Specializes in developing the academic experience for students in dealing with the requirements of their educational path by presenting various initiatives that contribute to overcoming study obstacles, thereby enhancing their performance and academic achievement.',
                descriptionAr: 'يتخصص في تطوير التجربة الأكاديمية للطلاب في التعامل مع متطلبات مسارهم التعليمي من خلال تقديم مبادرات متنوعة تساهم في تخطي العقبات الدراسية، وبالتالي تعزيز أدائهم وتحصيلهم الأكاديمي.'
            },
            {
                name: 'Activities and Training Office',
                nameAr: 'مكتب الأنشطة والتدريب',
                subtitle: '',
                subtitleAr: '',
                description: 'Presents the academic side in a new suit that enhances students\' passion for their field. It enables them to acquire applied skills that bridge the gap between theoretical education and practical application, preparing the student in terms of capabilities and skills required for their professional future.',
                descriptionAr: 'يقدم الجانب الأكاديمي في حلة جديدة تعزز شغف الطلاب بمجالهم. يمكنهم من اكتساب مهارات تطبيقية تسد الفجوة بين التعليم النظري والتطبيق العملي، مما يعد الطالب من حيث القدرات والمهارات المطلوبة لمستقبله المهني.'
            },
            {
                name: 'Scientific Research Office',
                nameAr: 'مكتب البحث العلمي',
                subtitle: '',
                subtitleAr: '',
                description: 'Fosters a culture of scientific research among college students through a set of activities and educational/applied programs that refine their research skills. It encourages innovation and scientific inquiry, contributing to creating a thinking and creative university society.',
                descriptionAr: 'يعزز ثقافة البحث العلمي بين طلاب الكلية من خلال مجموعة من الأنشطة والبرامج التعليمية/التطبيقية التي تصقل مهاراتهم البحثية. يشجع الابتكار والاستقصاء العلمي، مما يساهم في خلق مجتمع جامعي مفكر ومبدع.'
            }
        ]
    },
    {
        id: 3,
        nameKey: 'sports',
        name: 'Sports Secretariat',
        nameAr: 'الأمانة الرياضية',
        description: 'The Sports Secretariat is concerned with managing sports activities in the college, supervising college teams in various sports, and raising student awareness about the history of sports and their benefits/importance.',
        descriptionAr: 'تهتم الأمانة الرياضية بإدارة الأنشطة الرياضية في الكلية، والإشراف على فرق الكلية في مختلف الرياضات، ورفع وعي الطلاب بتاريخ الرياضة وفوائدها/أهميتها.',
        offices: [
            {
                name: 'Team Sports Office',
                nameAr: 'مكتب الرياضات الجماعية',
                subtitle: '',
                subtitleAr: '',
                description: 'Focuses on organizing activities related to collective sports such as football (soccer), basketball, and volleyball.',
                descriptionAr: 'يركز على تنظيم الأنشطة المتعلقة بالرياضات الجماعية مثل كرة القدم وكرة السلة والكرة الطائرة.'
            },
            {
                name: 'Chess Club',
                nameAr: 'نادي الشطرنج',
                subtitle: '',
                subtitleAr: '',
                description: 'Specializes in holding chess events, including training sessions, friendly matches, and internal championships at the club level.',
                descriptionAr: 'يتخصص في إقامة فعاليات الشطرنج، بما في ذلك جلسات التدريب والمباريات الودية والبطولات الداخلية على مستوى النادي.'
            },
            {
                name: 'Table Tennis Club',
                nameAr: 'نادي تنس الطاولة',
                subtitle: '',
                subtitleAr: '',
                description: 'Specializes in table tennis leagues, supervising training sessions, and friendly matches.',
                descriptionAr: 'يتخصص في دوريات تنس الطاولة، والإشراف على جلسات التدريب والمباريات الودية.'
            }
        ]
    },
    {
        id: 4,
        nameKey: 'foreign',
        name: 'Foreign Affairs Secretariat',
        nameAr: 'أمانة الشؤون الخارجية',
        description: 'The Foreign Affairs Secretariat is the interface that links Engineering students with the academic and professional world outside the university borders.',
        descriptionAr: 'أمانة الشؤون الخارجية هي الواجهة التي تربط طلاب الهندسة بالعالم الأكاديمي والمهني خارج حدود الجامعة.',
        offices: [
            {
                name: 'External Communication Office',
                nameAr: 'مكتب التواصل الخارجي',
                subtitle: '',
                subtitleAr: '',
                description: 'Concerned with building bridges of communication with institutions inside and outside Sudan. It builds a network of international relations and partnerships that serve students and works on searching for cooperative opportunities, training, scholarships, and fellowships. It also organizes introductory events helping students discover global opportunities and how to apply for them professionally.',
                descriptionAr: 'معني ببناء جسور التواصل مع المؤسسات داخل وخارج السودان. يبني شبكة من العلاقات والشراكات الدولية التي تخدم الطلاب ويعمل على البحث عن فرص التعاون والتدريب والمنح الدراسية والزمالات. كما ينظم فعاليات تعريفية تساعد الطلاب على اكتشاف الفرص العالمية وكيفية التقديم لها بشكل احترافي.'
            },
            {
                name: 'Joint Action Office',
                nameAr: 'مكتب العمل المشترك',
                subtitle: '',
                subtitleAr: '',
                description: 'An office that works with an integrative spirit within the Association by coordinating with other Secretariats to ensure the implementation of joint programs with high efficiency. It contributes to planning student projects, coordinating events, and unifying efforts to serve the engineering community, enhancing internal cooperation and increasing the Secretariat\'s impact at the Association level.',
                descriptionAr: 'مكتب يعمل بروح تكاملية داخل الاتحاد من خلال التنسيق مع الأمانات الأخرى لضمان تنفيذ البرامج المشتركة بكفاءة عالية. يساهم في تخطيط المشاريع الطلابية وتنسيق الفعاليات وتوحيد الجهود لخدمة مجتمع الهندسة، مما يعزز التعاون الداخلي ويزيد من تأثير الأمانة على مستوى الاتحاد.'
            }
        ]
    },
    {
        id: 5,
        nameKey: 'cultural',
        name: 'Cultural Secretariat',
        nameAr: 'الأمانة الثقافية',
        description: 'Works on enriching university life, supporting clubs, and creating a space for expression, creativity, and belonging. It connects engineering students with their society and the world.',
        descriptionAr: 'تعمل على إثراء الحياة الجامعية ودعم الأندية وخلق مساحة للتعبير والإبداع والانتماء. تربط طلاب الهندسة بمجتمعهم والعالم.',
        offices: [
            {
                name: 'Literary Club',
                nameAr: 'النادي الأدبي',
                subtitle: '',
                subtitleAr: '',
                description: 'A platform gathering masters of the word—poets and writers. It encourages writing, expression, and the exchange of criticism and creative production.',
                descriptionAr: 'منصة تجمع أساتذة الكلمة - الشعراء والكتاب. يشجع الكتابة والتعبير وتبادل النقد والإنتاج الإبداعي.'
            },
            {
                name: 'Art Club',
                nameAr: 'نادي الفنون',
                subtitle: '',
                subtitleAr: '',
                description: 'A space gathering art lovers in its visual and performance environments, from drawing and photography to singing, theater, and music. It allows members to express their artistic vision in innovative ways.',
                descriptionAr: 'مساحة تجمع محبي الفن في بيئاته البصرية والأدائية، من الرسم والتصوير إلى الغناء والمسرح والموسيقى. تتيح للأعضاء التعبير عن رؤيتهم الفنية بطرق مبتكرة.'
            },
            {
                name: 'Scientific Club',
                nameAr: 'النادي العلمي',
                subtitle: '',
                subtitleAr: '',
                description: 'Connects theoretical sciences with societal and daily reality in an interactive style. It simplifies sciences and spreads scientific awareness within the student community.',
                descriptionAr: 'يربط العلوم النظرية بالواقع المجتمعي واليومي بأسلوب تفاعلي. يبسط العلوم وينشر الوعي العلمي داخل المجتمع الطلابي.'
            },
            {
                name: 'Debate Club',
                nameAr: 'نادي المناظرات',
                subtitle: '',
                subtitleAr: '',
                description: 'A space to enhance critical thinking and develop public speaking and persuasion skills. The club contributes to building the capabilities of analysis and logical discussion around various intellectual and social issues.',
                descriptionAr: 'مساحة لتعزيز التفكير النقدي وتطوير مهارات الخطابة والإقناع. يساهم النادي في بناء قدرات التحليل والنقاش المنطقي حول مختلف القضايا الفكرية والاجتماعية.'
            },
            {
                name: 'Languages Club',
                nameAr: 'نادي اللغات',
                subtitle: '',
                subtitleAr: '',
                description: 'A window to the world through learning new languages and discovering different cultures. It contributes to expanding horizons of communication and cultural openness.',
                descriptionAr: 'نافذة على العالم من خلال تعلم لغات جديدة واكتشاف ثقافات مختلفة. يساهم في توسيع آفاق التواصل والانفتاح الثقافي.'
            },
            {
                name: 'Podcast Committee',
                nameAr: 'لجنة البودكاست',
                subtitle: '',
                subtitleAr: '',
                description: 'An audio platform documenting human and social experiences within the engineering community. It highlights the diversity and talents that form the human face of engineering.',
                descriptionAr: 'منصة صوتية توثق التجارب الإنسانية والاجتماعية داخل مجتمع الهندسة. تسلط الضوء على التنوع والمواهب التي تشكل الوجه الإنساني للهندسة.'
            }
        ]
    },
    {
        id: 6,
        nameKey: 'social',
        name: 'Social Secretariat',
        nameAr: 'الأمانة الاجتماعية',
        description: 'The Social Secretariat is concerned with reinforcing values of solidarity and cooperation within the college community and working to improve the university environment materially and morally through its various offices.',
        descriptionAr: 'تهتم الأمانة الاجتماعية بتعزيز قيم التضامن والتعاون داخل مجتمع الكلية والعمل على تحسين البيئة الجامعية مادياً ومعنوياً من خلال مكاتبها المختلفة.',
        offices: [
            {
                name: 'Social Welfare Office',
                nameAr: 'مكتب الرعاية الاجتماعية',
                subtitle: 'The beating heart of the Social Secretariat.',
                subtitleAr: 'القلب النابض للأمانة الاجتماعية.',
                description: 'It plans to improve the conditions of students. It works on collecting data to monitor all problems facing students and channels support to those in need. It also executes charitable projects undertaken by the Association.',
                descriptionAr: 'يخطط لتحسين أوضاع الطلاب. يعمل على جمع البيانات لرصد جميع المشكلات التي تواجه الطلاب وتوجيه الدعم للمحتاجين. كما ينفذ المشاريع الخيرية التي يتبناها الاتحاد.'
            },
            {
                name: 'Mosque and Rest Area Office',
                nameAr: 'مكتب المسجد والاستراحة',
                subtitle: '',
                subtitleAr: '',
                description: 'Specializes in student affairs in the college regarding places of worship and rest. It supervises religious programs and lessons, as well as the annual Ramadan Iftar and many other activities.',
                descriptionAr: 'يتخصص في شؤون الطلاب في الكلية فيما يتعلق بأماكن العبادة والراحة. يشرف على البرامج والدروس الدينية، وكذلك إفطار رمضان السنوي والعديد من الأنشطة الأخرى.'
            },
            {
                name: 'Services Office',
                nameAr: 'مكتب الخدمات',
                subtitle: '',
                subtitleAr: '',
                description: 'Concerned with the facilities of the college, divided into two main sections: Water and Restrooms. It shares responsibility with the Mosque and Rest Area Office regarding water connections and drinking water provision, ensuring a suitable environment for everyone.',
                descriptionAr: 'معني بمرافق الكلية، مقسم إلى قسمين رئيسيين: المياه ودورات المياه. يتقاسم المسؤولية مع مكتب المسجد والاستراحة فيما يتعلق بتوصيلات المياه وتوفير مياه الشرب، لضمان بيئة مناسبة للجميع.'
            },
            {
                name: 'University Environment Office',
                nameAr: 'مكتب البيئة الجامعية',
                subtitle: '',
                subtitleAr: '',
                description: 'Closely linked to the Services Office, it is concerned with the aesthetics of the college, including cleaning, murals, and afforestation (planting), in addition to caring for shades and benches, adding splendor and beauty to the university environment.',
                descriptionAr: 'مرتبط ارتباطاً وثيقاً بمكتب الخدمات، يهتم بجماليات الكلية، بما في ذلك التنظيف والجداريات والتشجير، بالإضافة إلى العناية بالمظلات والمقاعد، مما يضيف روعة وجمالاً للبيئة الجامعية.'
            }
        ]
    },
    {
        id: 7,
        nameKey: 'financial',
        name: 'Financial Secretariat',
        nameAr: 'الأمانة المالية',
        description: 'The Financial Secretariat is concerned with controlling the income and outflow of money in the Association\'s treasury, creating accounting schedules and budgets, and managing the financial development of the Association.',
        descriptionAr: 'تهتم الأمانة المالية بضبط الدخل والمصروفات في خزينة الاتحاد، وإنشاء جداول المحاسبة والميزانيات، وإدارة التطوير المالي للاتحاد.',
        offices: [
            {
                name: 'Financial Follow-up Office',
                nameAr: 'مكتب المتابعة المالية',
                subtitle: '',
                subtitleAr: '',
                description: 'Concerned with accounting affairs, controlling data schedules, documenting and archiving purchases and invoices, and following up on financial work in other Secretariats.',
                descriptionAr: 'معني بالشؤون المحاسبية، وضبط جداول البيانات، وتوثيق وأرشفة المشتريات والفواتير، ومتابعة العمل المالي في الأمانات الأخرى.'
            },
            {
                name: 'Projects and Partnerships Office',
                nameAr: 'مكتب المشاريع والشراكات',
                subtitle: '',
                subtitleAr: '',
                description: 'Concerned with research and development purposes. Work is based on principles of "Entrepreneurship" and innovation to create solutions that reduce expenses or increase financial inputs for the Association.',
                descriptionAr: 'معني بأغراض البحث والتطوير. يقوم العمل على مبادئ "ريادة الأعمال" والابتكار لخلق حلول تقلل النفقات أو تزيد المدخلات المالية للاتحاد.'
            }
        ]
    },
    {
        id: 8,
        nameKey: 'general',
        name: 'General Secretariat',
        nameAr: 'الأمانة العامة',
        description: 'The General Secretariat is considered the beating heart of the Steering Engineering Association, as it is responsible for coordinating between the different Secretariats of the Association and the Executive Committee Presidency. It organizes relationships between Secretariats and adopts their plans, visions, and programs. It is the head of the Secretariats and the most dynamic.',
        descriptionAr: 'تعتبر الأمانة العامة القلب النابض لاتحاد الهندسة التسييري، حيث تتولى مسؤولية التنسيق بين أمانات الاتحاد المختلفة ورئاسة اللجنة التنفيذية. تنظم العلاقات بين الأمانات وتتبنى خططها ورؤاها وبرامجها. هي رأس الأمانات والأكثر ديناميكية.',
        offices: [
            {
                name: 'Awareness Office',
                nameAr: 'مكتب التوعية',
                subtitle: '',
                subtitleAr: '',
                description: 'Concerned with raising awareness among General Assembly members about public work and union work in universities and their benefits. It simplifies concepts related to levels of public work in the university for members, starting from the "University Family" up to the University of Khartoum Students\' Union. It is also concerned with drafting the vision of Engineering College students for the return of the University of Khartoum Students\' Union.',
                descriptionAr: 'معني برفع الوعي بين أعضاء الجمعية العمومية حول العمل العام والعمل النقابي في الجامعات وفوائده. يبسط المفاهيم المتعلقة بمستويات العمل العام في الجامعة للأعضاء، بدءاً من "الأسرة الجامعية" وصولاً إلى اتحاد طلاب جامعة الخرطوم. كما يهتم بصياغة رؤية طلاب كلية الهندسة لعودة اتحاد طلاب جامعة الخرطوم.'
            },
            {
                name: 'Technical Office',
                nameAr: 'المكتب الفني',
                subtitle: '',
                subtitleAr: '',
                description: 'The office responsible for building and managing the Association\'s website. The website will be a space for General Assembly members and visitors to know everything they need about the Faculty of Engineering and the Steering Engineering Association and its various offices. It will also contain several sections to automate the engineering association\'s systems and internal procedures.',
                descriptionAr: 'المكتب المسؤول عن بناء وإدارة موقع الاتحاد الإلكتروني. سيكون الموقع مساحة لأعضاء الجمعية العمومية والزوار لمعرفة كل ما يحتاجونه عن كلية الهندسة واتحاد الهندسة التسييري ومكاتبه المختلفة. كما سيحتوي على عدة أقسام لأتمتة أنظمة اتحاد الهندسة وإجراءاته الداخلية.'
            }
        ]
    }
];

const Secretariats = () => {
    const { language } = useLanguage();
    const isArabic = language === 'ar';

    // Fetch dynamic content from API (for future admin-editable content)
    const { data: dynamicContent, isLoading, isError } = useSecretariats();

    const introTitle = isArabic
        ? 'مقدمة عن سلسلة مكاتب الأمانات'
        : 'Introduction to the Secretariat Offices Series';

    const pageTitle = isArabic
        ? 'أمانات الاتحاد'
        : "Association's Secretariats";

    return (
        <div className="secretariats-page" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <div className="secretariats-hero">
                <Container>
                    <h1>{pageTitle}</h1>
                    <p className="lead">
                        {isArabic
                            ? 'تعرف على الأمانات الثمانية التي تشكل العمود الفقري لاتحاد الهندسة التسييري، كل منها مكرسة لخدمة مجتمع الهندسة بطرق فريدة ومتميزة.'
                            : 'Discover the eight secretariats that form the backbone of the Steering Engineering Association, each dedicated to serving the engineering community in unique and distinguished ways.'}
                    </p>
                </Container>
            </div>

            <Container className="pb-5">
                {/* Introduction Section */}
                <div className="secretariats-intro">
                    <h2>{introTitle}</h2>
                    <p>
                        {isArabic
                            ? 'يتكون اتحاد الهندسة التسييري من ثمان أمانات، تعمل كل منها بتناغم لتحقيق رؤية الاتحاد في خدمة الطلاب وتطوير البيئة الجامعية. تتضمن كل أمانة مجموعة من المكاتب المتخصصة التي تغطي جوانب مختلفة من الحياة الطلابية والأكاديمية والاجتماعية.'
                            : 'The Steering Engineering Association consists of eight secretariats, each working in harmony to achieve the Association\'s vision of serving students and developing the university environment. Each secretariat includes a set of specialized offices covering different aspects of student, academic, and social life.'}
                    </p>
                </div>

                {/* Secretariats List */}
                <Row>
                    {secretariatsData.map((secretariat) => (
                        <Col xs={12} key={secretariat.id}>
                            <div className="secretariat-card">
                                <h2>
                                    <span className="secretariat-number">{secretariat.id}</span>
                                    {isArabic ? secretariat.nameAr : secretariat.name}
                                </h2>

                                <p className="secretariat-description">
                                    {isArabic ? secretariat.descriptionAr : secretariat.description}
                                </p>

                                <div className="offices-section">
                                    <h3 className="offices-title">
                                        {isArabic
                                            ? `مكاتب/أندية ${secretariat.nameAr}:`
                                            : `Offices of the ${secretariat.name}:`}
                                    </h3>

                                    <ul className="offices-list">
                                        {secretariat.offices.map((office, index) => (
                                            <li className="office-list-item" key={index}>
                                                <strong>{isArabic ? office.nameAr : office.name}</strong>
                                                {(isArabic ? office.subtitleAr : office.subtitle) && (
                                                    <span className="office-subtitle">
                                                        {' - '}{isArabic ? office.subtitleAr : office.subtitle}
                                                    </span>
                                                )}
                                                <p className="office-description">
                                                    {isArabic ? office.descriptionAr : office.description}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Secretariats;
