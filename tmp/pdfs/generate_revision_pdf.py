from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    Preformatted,
    HRFlowable,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os


ROOT = Path(r"C:\Users\alber\Documents\portfolio-dynamique")
PDF_PATH = ROOT / "output" / "pdf" / "support_revision_soutenance_portfolio.pdf"
PDF_PATH.parent.mkdir(parents=True, exist_ok=True)

arial = r"C:\Windows\Fonts\arial.ttf"
arial_bold = r"C:\Windows\Fonts\arialbd.ttf"
consola = r"C:\Windows\Fonts\consola.ttf"

if os.path.exists(arial):
    pdfmetrics.registerFont(TTFont("DocFont", arial))
    pdfmetrics.registerFont(TTFont("DocFontBold", arial_bold))
    BASE_FONT = "DocFont"
    BOLD_FONT = "DocFontBold"
else:
    BASE_FONT = "Helvetica"
    BOLD_FONT = "Helvetica-Bold"

if os.path.exists(consola):
    pdfmetrics.registerFont(TTFont("CodeFont", consola))
    CODE_FONT = "CodeFont"
else:
    CODE_FONT = "Courier"


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleBlue",
        parent=styles["Title"],
        fontName=BOLD_FONT,
        fontSize=25,
        leading=30,
        textColor=colors.HexColor("#07111f"),
        alignment=TA_CENTER,
        spaceAfter=14,
    )
)
styles.add(
    ParagraphStyle(
        name="Subtitle",
        parent=styles["Normal"],
        fontName=BASE_FONT,
        fontSize=12,
        leading=17,
        textColor=colors.HexColor("#334155"),
        alignment=TA_CENTER,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="H1",
        parent=styles["Heading1"],
        fontName=BOLD_FONT,
        fontSize=17,
        leading=22,
        textColor=colors.HexColor("#1d4ed8"),
        spaceBefore=10,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="H2",
        parent=styles["Heading2"],
        fontName=BOLD_FONT,
        fontSize=13.5,
        leading=17,
        textColor=colors.HexColor("#07111f"),
        spaceBefore=8,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["Normal"],
        fontName=BASE_FONT,
        fontSize=9.6,
        leading=13.2,
        textColor=colors.HexColor("#1f2937"),
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["Normal"],
        fontName=BASE_FONT,
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#475569"),
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="Jury",
        parent=styles["Normal"],
        fontName=BOLD_FONT,
        fontSize=9.3,
        leading=12.5,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#dbeafe"),
        borderPadding=7,
        borderWidth=0.5,
        borderColor=colors.HexColor("#93c5fd"),
        spaceBefore=5,
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        name="Warn",
        parent=styles["Normal"],
        fontName=BASE_FONT,
        fontSize=9.1,
        leading=12.5,
        textColor=colors.HexColor("#713f12"),
        backColor=colors.HexColor("#fef3c7"),
        borderPadding=7,
        borderWidth=0.5,
        borderColor=colors.HexColor("#facc15"),
        spaceBefore=5,
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        name="CodeBlock",
        parent=styles["Code"],
        fontName=CODE_FONT,
        fontSize=7.6,
        leading=9.6,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f8fafc"),
        borderPadding=5,
        borderColor=colors.HexColor("#cbd5e1"),
        borderWidth=0.35,
        spaceBefore=4,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="TOC",
        parent=styles["Normal"],
        fontName=BASE_FONT,
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=3,
    )
)

story = []
blue = colors.HexColor("#2563eb")
dark = colors.HexColor("#07111f")
border = colors.HexColor("#cbd5e1")


def p(text, style="Body"):
    story.append(Paragraph(text, styles[style]))


def h1(text):
    if story and story[-1].__class__.__name__ != "PageBreak":
        story.append(PageBreak())
    story.append(Paragraph(text, styles["H1"]))
    story.append(HRFlowable(width="100%", thickness=0.8, color=blue, spaceAfter=8))


def h2(text):
    story.append(Paragraph(text, styles["H2"]))


def bullets(items):
    for item in items:
        p("- " + item)


def code(text):
    story.append(Preformatted(text.strip("\n"), styles["CodeBlock"]))


def jury(text):
    p("Phrase orale jury : " + text, "Jury")


def warn(text):
    p(text, "Warn")


def table(rows, widths=None):
    widths = widths or [5.0 * cm, 10.0 * cm]
    data = [[Paragraph(str(cell), styles["Small"]) for cell in row] for row in rows]
    t = Table(data, colWidths=widths, hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e0ecff")),
                ("TEXTCOLOR", (0, 0), (-1, 0), dark),
                ("GRID", (0, 0), (-1, -1), 0.35, border),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(t)
    story.append(Spacer(1, 8))


def footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(colors.HexColor("#cbd5e1"))
    canvas.line(1.5 * cm, 1.25 * cm, width - 1.5 * cm, 1.25 * cm)
    canvas.setFont(BASE_FONT, 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(1.5 * cm, 0.8 * cm, "Support revision soutenance - Portfolio dynamique")
    canvas.drawRightString(width - 1.5 * cm, 0.8 * cm, f"Page {doc.page}")
    canvas.restoreState()


story.append(Spacer(1, 3.0 * cm))
story.append(Paragraph("Support de revision technique", styles["TitleBlue"]))
story.append(Paragraph("Portfolio dynamique - preparation soutenance jury", styles["Subtitle"]))
story.append(Spacer(1, 0.5 * cm))
table(
    [
        ["Projet", "Portfolio dynamique Albert TAYO"],
        ["Objectif", "Comprendre et expliquer le code de A a Z pendant la soutenance"],
        ["Stack", "React, Vite, Node.js, Express, MongoDB Atlas, Mongoose, JWT"],
        ["Usage", "Fiche de defense technique pour reviser avant l'examen"],
    ],
    [4 * cm, 11 * cm],
)
p(
    "Ce document est une fiche de defense technique. Il sert a reviser les fonctionnalites, les choix techniques, les chemins de fichiers, les lignes importantes et les phrases courtes a dire au jury."
)
p(
    "Methode conseillee : ouvrir le fichier indique, retrouver les lignes citees, puis s'entrainer a expliquer le flux complet sans lire le code mot a mot.",
    "Jury",
)
story.append(PageBreak())

h1("Sommaire")
for item in [
    "1. Vue d'ensemble du portfolio dynamique",
    "2. Demarrage du front React et liaison CSS",
    "3. Routing et navigation des pages",
    "4. Chargement dynamique des projets, competences et CV",
    "5. Formulaire de contact : front, API et MongoDB",
    "6. Connexion administrateur et JWT",
    "7. Protection du back-office",
    "8. Dashboard admin : chargement global des donnees",
    "9. CRUD des projets",
    "10. CRUD des competences",
    "11. Modification du profil et du CV",
    "12. Gestion des messages de contact",
    "13. Upload d'image projet",
    "14. Serveur Express et organisation des routes",
    "15. Base de donnees MongoDB et modeles Mongoose",
    "16. Validation des donnees",
    "17. Securite globale",
    "18. Gestion des erreurs",
    "19. Variables d'environnement et deploiement",
    "20. Questions probables du jury",
    "Annexe - Parcours court de demonstration orale",
]:
    p(item, "TOC")
story.append(PageBreak())

sections = [
    (
        "1. Vue d'ensemble du portfolio dynamique",
        [
            ("Concept cle", "Le projet est une application full-stack separee en deux parties : un front-end React pour l'interface utilisateur et un back-end Express pour l'API. Les donnees dynamiques sont stockees dans MongoDB Atlas et l'administration permet de modifier le contenu sans toucher directement au code."),
            ("Architecture generale", None),
        ],
        [
            ["Couche", "Role concret dans le projet"],
            ["Front-end", "Pages publiques, navigation, formulaires, dashboard admin. Dossier : front/src."],
            ["Back-end", "API REST, securite, validations, CRUD, connexion MongoDB. Dossier : back/src."],
            ["Base de donnees", "MongoDB Atlas stocke projets, competences, CV, messages et administrateur."],
            ["Deploiement", "Vercel pour le front, Render pour le back, MongoDB Atlas pour les donnees."],
        ],
        [
            "front/src/App.jsx : declare les pages et protege /admin cote front.",
            "front/src/services/api.js : centralise tous les appels HTTP.",
            "back/src/app.js : configure Express et branche les routes API.",
            "back/src/routes : contient les routes publiques et admin.",
            "back/src/models : contient les schemas Mongoose.",
            "back/src/middlewares : contient la securite, la validation et les erreurs.",
        ],
        "Mon projet est decoupe en front, back et base de donnees. Le front affiche l'interface, le back expose une API REST, et MongoDB conserve les contenus dynamiques du portfolio.",
    ),
]

for title, paragraphs, tab, bullet_list, oral in sections:
    h1(title)
    for subtitle, text in paragraphs:
        h2(subtitle)
        if text:
            p(text)
    table(tab)
    h2("Chemins importants")
    bullets(bullet_list)
    jury(oral)

h1("2. Demarrage du front React et liaison CSS")
h2("Concept cle")
p("Avec React et Vite, on ne relie pas les fichiers CSS avec une balise link comme dans une page HTML classique. Les fichiers CSS sont importes directement dans les fichiers JavaScript/JSX, puis Vite les integre au bundle de l'application.")
h2("Dossier et lignes")
table([
    ["Fichier", "Lignes cles"],
    ["front/src/main.jsx", "ligne 3 : import './index.css'"],
    ["front/src/App.jsx", "ligne 3 : import './App.css'"],
    ["front/src/App.css", "styles des pages, responsive, header, footer et admin."],
])
bullets([
    "main.jsx cree le point d'entree React avec createRoot.",
    "index.css contient les regles globales.",
    "App.css centralise la charte graphique du portfolio.",
    "La typographie principale est Inter, Arial, sans-serif.",
])
code("""// front/src/main.jsx
import './index.css'
import App from './App.jsx'

// front/src/App.jsx
import './App.css';""")
jury("Dans mon projet React, les CSS sont importes dans les composants. Vite s'occupe ensuite de les compiler et de les injecter dans l'application.")

h1("3. Routing et navigation des pages")
h2("Concept cle")
p("Le routing permet de changer de page sans recharger completement le site. React Router gere les URLs et affiche le composant correspondant.")
table([
    ["Fichier", "Role"],
    ["front/src/App.jsx:1", "Import de BrowserRouter, Routes, Route et Navigate."],
    ["front/src/App.jsx:27-53", "Declaration des routes publiques et admin."],
    ["front/src/components/Header.jsx:1-3", "Navigation avec NavLink et menu burger."],
    ["front/src/App.jsx:62-67", "Protection front de la route /admin."],
])
table([
    ["URL", "Page React"],
    ["/", "Home"],
    ["/a-propos", "About"],
    ["/cv", "Cv"],
    ["/competences", "Skills"],
    ["/projets", "Projects"],
    ["/contact", "Contact"],
    ["/admin/login", "AdminLogin"],
    ["/admin", "AdminDashboard protege par AdminRoute"],
])
code("""// front/src/App.jsx lignes 43-49
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>""")
jury("J'utilise React Router pour structurer les pages du portfolio. La route admin est encapsulee dans un composant de protection qui redirige vers la connexion si aucun token n'est present.")

h1("4. Chargement dynamique des projets, competences et CV")
h2("Concept cle")
p("Une interface dynamique charge des donnees, les stocke dans l'etat React, puis les affiche avec map. Ici les donnees viennent de l'API Express ou de fichiers JSON statiques si l'URL de l'API n'est pas configuree.")
code("""// front/src/services/api.js lignes 57-66
export function getProjects() {
  return fetchJson(API_BASE_URL ? "/api/projects" : "/api/projects.json");
}
export function getSkills() {
  return fetchJson(API_BASE_URL ? "/api/skills" : "/api/skills.json");
}
export function getProfileCv() {
  return fetchJson(API_BASE_URL ? "/api/profile-cv" : "/api/profile-cv.json");
}""")
table([
    ["Page", "Chargement"],
    ["Home.jsx:13-16", "charge les projets puis filtre les projets mis en avant."],
    ["Projects.jsx:10-13", "charge tous les projets."],
    ["Skills.jsx:77-80", "charge les groupes de competences et statistiques."],
    ["Cv.jsx:47-50", "charge le profil CV."],
])
bullets([
    "Initialiser un state avec useState.",
    "Lancer useEffect au montage de la page.",
    "Appeler la fonction API correspondante.",
    "Mettre a jour le state.",
    "Afficher les donnees avec map dans le JSX.",
])
jury("Pour rendre le front dynamique, je charge les donnees avec useEffect, je les place dans le state React, puis je les affiche avec map. Les appels sont centralises dans api.js.")

h1("5. Formulaire de contact : front, API et MongoDB")
h2("Concept cle")
p("Un formulaire dynamique collecte les champs, valide les donnees, envoie une requete HTTP, puis affiche un retour utilisateur. Le serveur revalide ensuite les donnees avant l'insertion en base.")
table([
    ["Fichier", "Lignes cles"],
    ["front/src/pages/Contact.jsx:42-44", "state formData et formStatus."],
    ["front/src/pages/Contact.jsx:62", "validation avant envoi."],
    ["front/src/pages/Contact.jsx:70-71", "appel a sendContactMessage."],
    ["front/src/pages/Contact.jsx:216-231", "fonction validateContactForm."],
    ["front/src/services/api.js:70-92", "envoi vers POST /api/contact ou mode demo localStorage."],
])
code("""// front/src/pages/Contact.jsx lignes 216-231
function validateContactForm({ name, email, subject, message }) {
  if (!name || !email || !subject || !message) return "Merci de remplir tous les champs du formulaire.";
  if (!email.includes("@") || !email.includes(".")) return "Merci de saisir une adresse email valide.";
  if (message.trim().length < 10) return "Votre message doit contenir au moins 10 caracteres.";
  return null;
}""")
table([
    ["Fichier", "Role"],
    ["back/src/routes/contact.routes.js:8-14", "cree le message avec ContactMessage.create."],
    ["back/src/routes/contact.routes.js:32", "route POST /api/contact avec validateRequest(contactRules)."],
    ["back/src/models/ContactMessage.js:4-49", "schema MongoDB du message."],
    ["back/src/validators/portfolio.validators.js:20", "regles de validation du formulaire contact."],
])
jury("Le formulaire est controle deux fois : une premiere validation cote React pour l'experience utilisateur, puis une validation cote serveur avant l'enregistrement MongoDB.")

h1("6. Connexion administrateur et JWT")
h2("Concept cle")
p("Un JWT est un jeton signe par le serveur apres une connexion reussie. Le front le renvoie ensuite dans l'en-tete Authorization pour prouver que l'utilisateur est authentifie.")
bullets([
    "Le portfolio a un back-office reserve a l'administrateur.",
    "Le JWT evite de renvoyer le mot de passe a chaque requete.",
    "Le serveur peut verifier la signature et l'expiration du token.",
    "Le role admin est present dans le token pour proteger les routes sensibles.",
])
table([
    ["Fichier", "Lignes cles"],
    ["front/src/pages/AdminLogin.jsx:33-34", "appel loginAdmin puis navigation vers /admin."],
    ["front/src/services/api.js:96-107", "POST /api/auth/login puis stockage du token."],
    ["back/src/routes/auth.routes.js:47-60", "verification email/password et renvoi du JWT."],
    ["back/src/routes/auth.routes.js:16-27", "creation du token avec jwt.sign."],
    ["back/src/middlewares/authMiddleware.js:22-33", "verification du token avec jwt.verify."],
])
code("""// back/src/routes/auth.routes.js lignes 16-27
function createAdminToken(admin) {
  const tokenPayload = { id: admin.id, email: admin.email, role: admin.role };
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  });
}""")
code("""// front/src/services/api.js lignes 104-107
const data = await readApiResponse(response, "Connexion admin impossible.");
localStorage.setItem(ADMIN_TOKEN_KEY, data.token);""")
jury("Quand l'admin se connecte, le serveur verifie le mot de passe avec bcrypt, genere un JWT signe avec JWT_SECRET, puis le front le stocke et l'envoie dans Authorization: Bearer pour les routes admin.")

h1("7. Protection du back-office")
h2("Concept cle")
p("Une protection front seule ne suffit jamais. Dans le projet, la securite importante est cote back avec un middleware qui verifie le JWT avant chaque route admin.")
table([
    ["Fichier", "Role"],
    ["front/src/App.jsx:62-67", "AdminRoute redirige vers /admin/login si aucun token local n'est present."],
    ["front/src/services/api.js:10-11", "hasAdminToken lit la presence du token."],
    ["back/src/routes/admin.routes.js:12", "router.use(requireAdminAuth) protege toutes les sous-routes admin."],
    ["back/src/middlewares/authMiddleware.js:3-13", "lecture du Bearer token."],
    ["back/src/middlewares/authMiddleware.js:31-43", "verification du token, du role admin, puis next()."],
])
code("""// back/src/routes/admin.routes.js lignes 12-19
router.use(requireAdminAuth);
router.use("/projects", adminProjectsRoutes);
router.use("/skills", adminSkillsRoutes);
router.use("/profile", adminProfileRoutes);
router.use("/messages", adminMessagesRoutes);
router.use("/uploads", adminUploadsRoutes);""")
code("""// back/src/middlewares/authMiddleware.js lignes 31-43
const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
if (!isAdminToken(decodedToken)) {
  return res.status(403).json({ message: "Acces reserve a l'administrateur." });
}
req.admin = decodedToken;
next();""")
jury("J'ai une protection cote front pour l'ergonomie, mais la vraie securite est cote serveur : toutes les routes /api/admin passent par requireAdminAuth.")

h1("8. Dashboard admin : chargement global des donnees")
h2("Concept cle")
p("Le dashboard est le centre de gestion du portfolio. Il charge au depart l'admin courant, les projets, les competences, le profil et les messages.")
table([
    ["Lignes", "Role dans front/src/pages/AdminDashboard.jsx"],
    ["45-60", "states React : admin, sections, projets, competences, profil, messages, formulaires."],
    ["64-89", "useEffect verifyAdminSession pour charger toutes les donnees admin."],
    ["69-72", "Promise.all charge projets, competences, profil et messages."],
    ["84", "redirection vers login si la session est invalide."],
])
code("""// front/src/pages/AdminDashboard.jsx lignes 68-73
const [currentAdmin, adminProjects, adminSkills, adminProfile, adminMessages] = await Promise.all([
  getCurrentAdmin(),
  getAdminProjects(),
  getAdminSkills(),
  getAdminProfile(),
  getAdminMessages(),
]);""")
jury("Le dashboard charge les donnees principales en une seule phase avec Promise.all, ce qui evite d'avoir des appels disperses dans chaque onglet.")

h1("9. CRUD des projets")
h2("Concept cle")
p("CRUD signifie Create, Read, Update, Delete. Dans le projet, l'admin peut creer, lire, modifier et supprimer les projets affiches sur le portfolio.")
table([
    ["Cote front", "Lignes cles"],
    ["ProjectAdminSection.jsx:20-93", "formulaire projet."],
    ["AdminDashboard.jsx:155-169", "saveProject : create ou update."],
    ["AdminDashboard.jsx:175", "editProject remplit le formulaire."],
    ["AdminDashboard.jsx:190-193", "removeProject supprime puis recharge la liste."],
    ["api.js:121-145", "fonctions get/create/update/delete projets."],
])
table([
    ["Cote back", "Lignes cles"],
    ["adminProjects.routes.js:31-35", "GET admin projects."],
    ["adminProjects.routes.js:41-44", "POST creation."],
    ["adminProjects.routes.js:55-68", "PUT modification."],
    ["adminProjects.routes.js:74-83", "DELETE suppression."],
    ["adminProjects.routes.js:89-92", "declaration des routes CRUD."],
    ["models/Project.js:4-72", "schema Mongoose du projet."],
])
code("""// back/src/routes/adminProjects.routes.js lignes 89-92
router.get("/", getAdminProjects);
router.post("/", validateRequest(projectRules), createAdminProject);
router.put("/:id", validateRequest([...projectIdRules, ...projectRules]), updateAdminProject);
router.delete("/:id", validateRequest(projectIdRules), deleteAdminProject);""")
jury("Pour les projets, j'ai un CRUD complet. Le front pilote le formulaire et l'API Express applique la validation avant d'agir sur MongoDB avec Mongoose.")

h1("10. CRUD des competences")
h2("Concept cle")
p("Les competences sont stockees dans un document Skill contenant des groupes. L'admin ajoute, modifie ou supprime des items dans ces groupes.")
table([
    ["Cote front", "Lignes cles"],
    ["SkillAdminSection.jsx:19-43", "formulaire competence."],
    ["AdminDashboard.jsx:201-215", "saveSkill : create ou update."],
    ["AdminDashboard.jsx:221", "editSkill."],
    ["AdminDashboard.jsx:231-234", "removeSkill."],
    ["api.js:148-170", "fonctions API competences."],
])
table([
    ["Cote back", "Lignes cles"],
    ["adminSkills.routes.js:13-14", "recupere le document Skill."],
    ["adminSkills.routes.js:38-39", "trouve un groupe par titre."],
    ["adminSkills.routes.js:53-64", "ajout d'une competence."],
    ["adminSkills.routes.js:72-88", "modification."],
    ["adminSkills.routes.js:94-108", "suppression."],
    ["models/Skill.js:5-102", "schema groupes, items et statistiques."],
])
code("""// back/src/routes/adminSkills.routes.js lignes 115-118
router.get("/", getAdminSkills);
router.post("/", validateRequest(skillRules), createAdminSkill);
router.put("/", validateRequest(updateSkillRules), updateAdminSkill);
router.delete("/", validateRequest(deleteSkillRules), deleteAdminSkill);""")
jury("Les competences sont organisees par groupes dans MongoDB. Le back retrouve le bon groupe, modifie son tableau d'items, puis sauvegarde le document avec skills.save().")

h1("11. Modification du profil et du CV")
h2("Concept cle")
p("Le CV est un contenu dynamique complexe : il contient une partie hero, l'identite, les competences, les langues, les hobbies, les formations et les experiences. Le front transforme un formulaire texte en objet structure avant l'envoi au back.")
table([
    ["Fichier", "Role"],
    ["ProfileAdminSection.jsx:9-78", "formulaire profil/CV."],
    ["adminFormHelpers.js:129-148", "cree le formulaire depuis l'objet MongoDB."],
    ["adminFormHelpers.js:148-164", "buildProfilePayload reconstruit l'objet pour l'API."],
    ["AdminDashboard.jsx:242-248", "saveProfile envoie updateAdminProfile."],
    ["Cv.jsx:47-50", "la page publique charge le CV."],
    ["adminProfile.routes.js:30-46", "mise a jour et save cote back."],
    ["models/ProfileCv.js:5-191", "schema complet du CV."],
])
code("""// front/src/pages/admin/adminFormHelpers.js lignes 148-164
export function buildProfilePayload(form) {
  return {
    hero: { name: form.name, title: form.title, summary: form.summary },
    identity: { age: form.age, contacts: textToContacts(form.contacts) },
    skills: textToList(form.skills),
    softSkills: textToList(form.softSkills),
    languages: textToList(form.languages),
    hobbies: textToHobbies(form.hobbies),
    formations: textToFormations(form.formations),
    experiences: textToExperiences(form.experiences),
  };
}""")
jury("Le CV est un bon exemple de transformation de donnees : le formulaire est lisible pour l'admin, puis le front reconstruit un objet structure compatible avec le modele Mongoose.")

h1("12. Gestion des messages de contact")
h2("Concept cle")
p("Les messages envoyes par les visiteurs sont enregistres dans MongoDB puis consultables et supprimables depuis le back-office.")
bullets([
    "Un visiteur remplit le formulaire Contact.",
    "Le message est enregistre dans ContactMessage via POST /api/contact.",
    "Le dashboard admin charge les messages avec getAdminMessages.",
    "L'admin peut supprimer un message depuis le dashboard.",
])
table([
    ["Fichier", "Lignes cles"],
    ["MessagesAdminSection.jsx:16-28", "affichage des messages."],
    ["AdminDashboard.jsx:256-263", "removeMessage."],
    ["api.js:184-190", "getAdminMessages et deleteAdminMessage."],
    ["adminMessages.routes.js:8-12", "lecture des messages."],
    ["adminMessages.routes.js:18-26", "suppression par id."],
    ["models/ContactMessage.js:4-49", "schema du message."],
])
jury("Les messages de contact sont stockes comme documents MongoDB. Le back-office permet de les consulter et de les supprimer via des routes admin protegees.")

h1("13. Upload d'image projet")
h2("Concept cle")
p("L'upload permet a l'admin d'ajouter une image de projet. Le front lit le fichier en base64, l'envoie a l'API, puis le back l'ecrit dans le dossier public/uploads et renvoie une URL publique.")
table([
    ["Cote front", "Role"],
    ["ProjectAdminSection.jsx:56-57", "declenche onImageUpload quand un fichier est choisi."],
    ["AdminDashboard.jsx:130-149", "uploadProjectImage appelle uploadAdminProjectImage."],
    ["adminFormHelpers.js:169-176", "readFileAsDataUrl lit le fichier en base64."],
    ["api.js:194-198", "POST /api/admin/uploads/images."],
])
table([
    ["Cote back", "Role"],
    ["adminUploads.routes.js:25-31", "extrait le contenu base64 et construit l'URL publique."],
    ["adminUploads.routes.js:38-55", "controle le type, la presence et la taille."],
    ["adminUploads.routes.js:79", "route POST /images."],
    ["app.js:53", "sert le dossier /uploads en statique."],
])
jury("L'upload est gere par le back-office : le front convertit l'image, le back la controle, l'enregistre, puis renvoie une URL utilisable dans les cartes projets.")

h1("14. Serveur Express et organisation des routes")
h2("Concept cle")
p("Express recoit les requetes HTTP, applique les middlewares, dirige vers la bonne route, puis renvoie une reponse JSON. Dans ce projet, chaque domaine fonctionnel a son propre fichier de route.")
table([
    ["Fichier", "Role"],
    ["back/src/server.js:9-11", "valide l'environnement, connecte MongoDB, puis lance le serveur."],
    ["back/src/config/database.js:4-13", "connectDatabase utilise MONGO_URI."],
    ["back/src/config/environment.js:53", "validateEnvironment controle la configuration."],
    ["back/src/app.js:31", "securityHeaders."],
    ["back/src/app.js:34-49", "CORS."],
    ["back/src/app.js:50", "lecture JSON avec limite 5mb."],
    ["back/src/app.js:62-68", "branche les routes API."],
    ["back/src/app.js:71-74", "404 et errorHandler."],
])
code("""// back/src/app.js lignes 62-68
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile-cv", profileCvRoutes);
app.use("/api/contact", contactRoutes);""")
jury("J'ai organise l'API par domaine : auth, admin, projects, skills, profile-cv et contact. app.js sert de point central pour brancher les routes et les middlewares.")

h1("15. Base de donnees MongoDB et modeles Mongoose")
h2("Concept cle")
p("MongoDB est une base NoSQL orientee documents. Mongoose sert d'ODM : il permet de definir des schemas, d'effectuer des CRUD et de transformer les documents avant de les envoyer au front.")
bullets([
    "Les donnees du portfolio se presentent naturellement en documents JSON.",
    "Les projets, competences et CV ont des structures souples.",
    "Le format JSON est coherent entre React, Express et MongoDB.",
    "Mongoose ajoute une couche de structure et de validation au-dessus de MongoDB.",
])
table([
    ["Modele", "Role"],
    ["Project - models/Project.js:4-72", "projets affiches dans le portfolio."],
    ["Skill - models/Skill.js:5-102", "groupes de competences et statistiques."],
    ["ProfileCv - models/ProfileCv.js:5-191", "profil complet et CV."],
    ["ContactMessage - models/ContactMessage.js:4-49", "messages du formulaire contact."],
    ["Admin - models/Admin.js:4-41", "compte administrateur et hash du mot de passe."],
])
code("""// back/src/models/Admin.js lignes 30-35
adminSchema.set("toJSON", {
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.passwordHash;
  },
});""")
jury("J'utilise Mongoose pour donner une structure aux documents MongoDB et pour nettoyer les donnees renvoyees au front, par exemple en supprimant le hash du mot de passe admin.")

h1("16. Validation des donnees")
h2("Concept cle")
p("La validation sert a refuser les donnees incompletes ou incorrectes avant de les traiter. Il y a une validation cote front pour l'ergonomie et une validation cote back pour la securite.")
table([
    ["Fichier", "Role"],
    ["back/src/middlewares/validateRequest.js:2", "fonction validateRequest(rules)."],
    ["back/src/validators/common.validators.js", "validateurs generiques : requiredString, validEmail, validUrl, validMongoIdParam."],
    ["back/src/validators/portfolio.validators.js", "regles propres au portfolio."],
])
table([
    ["Route", "Validation"],
    ["POST /api/contact", "contactRules - back/src/routes/contact.routes.js:32."],
    ["POST /api/auth/login", "loginRules - back/src/routes/auth.routes.js:76."],
    ["POST /api/admin/projects", "projectRules - back/src/routes/adminProjects.routes.js:90."],
    ["PUT /api/admin/profile", "profileRules - back/src/routes/adminProfile.routes.js:53."],
])
p("Cote front, le formulaire contact a une validation simple dans front/src/pages/Contact.jsx:216-231 pour eviter un envoi vide et donner un retour rapide a l'utilisateur.")
jury("Je ne fais pas confiance uniquement au front. Les donnees sont controlees cote serveur avec un middleware de validation avant l'insertion ou la modification en base.")

h1("17. Securite globale")
h2("Mesures presentes")
table([
    ["Mesure", "Implementation"],
    ["Mot de passe hashe", "bcrypt.compare dans auth.routes.js:35 et passwordHash cache dans Admin.js:35."],
    ["JWT", "jwt.sign dans auth.routes.js:24 et jwt.verify dans authMiddleware.js:33."],
    ["Routes admin protegees", "router.use(requireAdminAuth) dans admin.routes.js:12."],
    ["Limitation connexion", "loginRateLimiter.js:28-61."],
    ["CORS", "app.js:25-49 limite les origines autorisees."],
    ["Headers securite", "securityHeaders.js et app.js:31."],
    ["Variables sensibles", "JWT_SECRET, MONGO_URI, ADMIN_PASSWORD dans .env."],
    ["Validation", "validateRequest sur les routes sensibles."],
])
warn("Point a savoir pour le jury : stocker un JWT dans localStorage est simple pour un projet junior, mais il faut reconnaitre que des cookies httpOnly peuvent etre plus securises dans une application sensible.")
jury("La securite est traitee a plusieurs niveaux : authentification JWT, hash du mot de passe, protection des routes, validation des donnees, limitation des tentatives et configuration CORS.")

h1("18. Gestion des erreurs")
h2("Concept cle")
p("Une API doit renvoyer des erreurs propres en JSON. Cela permet au front d'afficher un message clair et evite d'exposer des details internes.")
table([
    ["Fichier", "Role"],
    ["back/src/middlewares/errorHandler.js:4", "notFoundHandler pour les routes inconnues."],
    ["back/src/middlewares/errorHandler.js:15", "errorHandler transforme les erreurs en JSON."],
    ["back/src/app.js:71-74", "branche les middlewares d'erreur en fin de pipeline."],
    ["front/src/services/api.js:14-23", "readApiResponse lit le JSON et lance une Error si response.ok est false."],
])
code("""// front/src/services/api.js lignes 14-23
async function readApiResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage || `Erreur API : ${response.status}`);
  }
  return data;
}""")
jury("J'ai centralise la lecture des reponses API dans api.js. Si le serveur renvoie une erreur, le front transforme cela en message exploitable par l'interface.")

h1("19. Variables d'environnement et deploiement")
h2("Concept cle")
p("Les variables d'environnement permettent de ne pas mettre les informations sensibles dans le code source et d'adapter la configuration entre local et production.")
table([
    ["Variable", "Role"],
    ["VITE_API_URL", "URL de l'API appelee par le front."],
    ["PORT", "port du serveur Express."],
    ["CLIENT_URL", "URL du front autorisee par CORS."],
    ["MONGO_URI", "chaine de connexion MongoDB Atlas."],
    ["JWT_SECRET", "secret de signature des JWT."],
    ["JWT_EXPIRES_IN", "duree de vie du token."],
    ["ADMIN_EMAIL / ADMIN_PASSWORD", "compte admin utilise par le seed."],
])
bullets([
    "Front sur Vercel : root front, build npm run build, sortie dist.",
    "Back sur Render : root back, build npm install, start npm start.",
    "Base sur MongoDB Atlas : le back s'y connecte avec MONGO_URI.",
    "Verification : tester /api/health, la connexion admin et les appels depuis le front.",
])
table([
    ["Fichier", "Lignes"],
    ["front/src/services/api.js:1", "lit import.meta.env.VITE_API_URL."],
    ["back/src/server.js:6", "PORT depuis process.env.PORT."],
    ["back/src/config/database.js:5", "MONGO_URI."],
    ["back/src/config/environment.js:27-53", "JWT_SECRET et CLIENT_URL."],
])
jury("Les secrets comme MONGO_URI et JWT_SECRET ne sont pas dans le code. Ils sont fournis par les fichiers .env en local et par Vercel/Render en production.")

h1("20. Questions probables du jury")
qa = [
    ("Pourquoi React et Vite ?", "React m'a permis de decouper l'interface en composants reutilisables. Vite apporte un serveur de developpement rapide et une configuration simple pour compiler le front."),
    ("Pourquoi une API REST ?", "L'API REST separe clairement le front du back. Le front consomme des endpoints JSON, et le back gere la logique metier, la securite et la base de donnees."),
    ("Quelle difference entre SQL et MongoDB ?", "SQL stocke les donnees dans des tables relationnelles avec des jointures. MongoDB stocke des documents JSON-like. Dans ce portfolio, le CV et les competences sont naturellement structurees en documents imbriques."),
    ("Comment prouvez-vous que les routes admin sont protegees ?", "Toutes les routes /api/admin passent par admin.routes.js ligne 12 : router.use(requireAdminAuth). Ce middleware verifie le JWT dans authMiddleware.js avec jwt.verify avant d'appeler next()."),
    ("Ou est le CRUD ?", "Le CRUD le plus complet est sur les projets : adminProjects.routes.js contient GET, POST, PUT et DELETE aux lignes 89-92. Cote front, AdminDashboard appelle createAdminProject, updateAdminProject et deleteAdminProject."),
    ("Comment fonctionne le formulaire de contact ?", "Contact.jsx valide les champs, api.js envoie POST /api/contact, contact.routes.js valide a nouveau puis cree un ContactMessage dans MongoDB."),
    ("Comment gerer une erreur API ?", "Le back renvoie une erreur JSON via errorHandler. Le front utilise readApiResponse dans api.js pour convertir une reponse non OK en Error et afficher un message adapte."),
    ("Quel point amelioreriez-vous ?", "Je pourrais ajouter des tests automatises, ameliorer l'accessibilite RGAA avec un audit dedie, et renforcer la securite du token avec un cookie httpOnly si le projet devenait plus sensible."),
    ("Comment expliquer le projet en 30 secondes ?", "C'est un portfolio dynamique full-stack. Le front React affiche les pages publiques et un dashboard admin. Le back Express expose une API REST, protege les routes admin avec JWT, valide les donnees et stocke les contenus dans MongoDB Atlas."),
]
for question, answer in qa:
    h2(question)
    p(answer)

story.append(PageBreak())
h1("Annexe - Mini parcours d'explication orale")
p("Si le jury te demande de montrer le code, utilise ce parcours court :")
bullets([
    "1. Ouvrir front/src/App.jsx pour montrer les routes et la protection /admin.",
    "2. Ouvrir front/src/services/api.js pour montrer les appels REST et le JWT dans Authorization.",
    "3. Ouvrir back/src/app.js pour montrer les routes API branchees dans Express.",
    "4. Ouvrir back/src/routes/auth.routes.js pour montrer login, bcrypt et jwt.sign.",
    "5. Ouvrir back/src/middlewares/authMiddleware.js pour montrer jwt.verify.",
    "6. Ouvrir back/src/routes/adminProjects.routes.js pour montrer un CRUD complet.",
    "7. Ouvrir back/src/models/Project.js pour montrer le schema Mongoose.",
    "8. Ouvrir back/src/validators/portfolio.validators.js pour montrer que les donnees sont controlees.",
])
jury("Je vais vous montrer le flux complet : la route React, l'appel API, la route Express, la validation, le modele Mongoose, puis la reponse JSON renvoyee au front.")

doc = SimpleDocTemplate(
    str(PDF_PATH),
    pagesize=A4,
    rightMargin=1.45 * cm,
    leftMargin=1.45 * cm,
    topMargin=1.45 * cm,
    bottomMargin=1.55 * cm,
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(PDF_PATH)
