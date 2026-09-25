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
PDF_PATH = ROOT / "output" / "pdf" / "reponses_5_questions_techniques_portfolio.pdf"
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
styles.add(ParagraphStyle(name="TitleBlue", parent=styles["Title"], fontName=BOLD_FONT, fontSize=24, leading=30, textColor=colors.HexColor("#07111f"), alignment=TA_CENTER, spaceAfter=12))
styles.add(ParagraphStyle(name="Subtitle", parent=styles["Normal"], fontName=BASE_FONT, fontSize=11.5, leading=16, textColor=colors.HexColor("#334155"), alignment=TA_CENTER, spaceAfter=8))
styles.add(ParagraphStyle(name="H1", parent=styles["Heading1"], fontName=BOLD_FONT, fontSize=16.5, leading=21, textColor=colors.HexColor("#1d4ed8"), spaceBefore=8, spaceAfter=7))
styles.add(ParagraphStyle(name="H2", parent=styles["Heading2"], fontName=BOLD_FONT, fontSize=12.6, leading=16, textColor=colors.HexColor("#07111f"), spaceBefore=7, spaceAfter=4))
styles.add(ParagraphStyle(name="Body", parent=styles["Normal"], fontName=BASE_FONT, fontSize=9.4, leading=13, textColor=colors.HexColor("#1f2937"), spaceAfter=5))
styles.add(ParagraphStyle(name="Small", parent=styles["Normal"], fontName=BASE_FONT, fontSize=8.3, leading=11.3, textColor=colors.HexColor("#475569"), spaceAfter=4))
styles.add(ParagraphStyle(name="Pitch", parent=styles["Normal"], fontName=BOLD_FONT, fontSize=9.2, leading=12.4, textColor=colors.HexColor("#0f172a"), backColor=colors.HexColor("#dbeafe"), borderPadding=7, borderWidth=0.5, borderColor=colors.HexColor("#93c5fd"), spaceBefore=5, spaceAfter=7))
styles.add(ParagraphStyle(name="CodeBlock", parent=styles["Code"], fontName=CODE_FONT, fontSize=7.2, leading=9.2, textColor=colors.HexColor("#0f172a"), backColor=colors.HexColor("#f8fafc"), borderPadding=5, borderColor=colors.HexColor("#cbd5e1"), borderWidth=0.35, spaceBefore=4, spaceAfter=6))

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


def code(text):
    story.append(Preformatted(text.strip("\n"), styles["CodeBlock"]))


def pitch(text):
    p("Pitch oral : " + text, "Pitch")


def bullets(items):
    for item in items:
        p("- " + item)


def table(rows, widths=None):
    widths = widths or [5.2 * cm, 9.8 * cm]
    data = [[Paragraph(str(cell), styles["Small"]) for cell in row] for row in rows]
    t = Table(data, colWidths=widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e0ecff")),
        ("TEXTCOLOR", (0, 0), (-1, 0), dark),
        ("GRID", (0, 0), (-1, -1), 0.35, border),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))


def footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(colors.HexColor("#cbd5e1"))
    canvas.line(1.5 * cm, 1.25 * cm, width - 1.5 * cm, 1.25 * cm)
    canvas.setFont(BASE_FONT, 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(1.5 * cm, 0.8 * cm, "Reponses techniques - Portfolio dynamique")
    canvas.drawRightString(width - 1.5 * cm, 0.8 * cm, f"Page {doc.page}")
    canvas.restoreState()


story.append(Spacer(1, 3 * cm))
story.append(Paragraph("Reponses aux 5 questions techniques", styles["TitleBlue"]))
story.append(Paragraph("Portfolio dynamique - preparation soutenance", styles["Subtitle"]))
table([
    ["Objectif", "Avoir des reponses correctes, simples et defendables devant le jury."],
    ["Contenu", "Concept, pourquoi, chemin du code, lignes cles, extrait et pitch oral."],
    ["Projet", "Portfolio dynamique Albert TAYO - React, Express, MongoDB, JWT."],
])
p("Lis chaque reponse en deux temps : d'abord comprendre le concept, puis apprendre le pitch oral. Pendant la soutenance, tu n'as pas besoin de reciter tout le code : tu dois montrer que tu comprends le flux.")

h1("1. Architecture : role de App.jsx, api.js et app.js")
h2("Explication theorique simple")
p("Une application full-stack est separee en couches. Le front gere l'affichage et les interactions utilisateur. Le back gere les routes, la logique serveur, la securite et la communication avec la base de donnees. Dans ton projet, trois fichiers structurent cette organisation.")
h2("Pourquoi c'est important")
p("Le jury peut te poser cette question pour verifier que tu sais ou se trouve chaque responsabilite. Une bonne reponse montre que tu comprends la separation front-end / back-end, et que ton code n'est pas un bloc melange.")
table([
    ["Fichier", "Role correct a expliquer"],
    ["front/src/App.jsx", "Point central du front. Il declare les routes React, affiche Header/Footer, et protege la route /admin avec AdminRoute."],
    ["front/src/services/api.js", "Service central des appels HTTP. Il contient les fonctions qui appellent l'API, gere le token admin et les erreurs de reponse."],
    ["back/src/app.js", "Configuration principale d'Express. Il active les middlewares, CORS, JSON, uploads, routes API et gestion d'erreurs."],
])
h2("Code a montrer")
code("""// front/src/App.jsx lignes 27-43
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/cv" element={<Cv />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
</Routes>""")
code("""// front/src/services/api.js lignes 27-31
async function fetchJson(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  return readApiResponse(response, "Donnees indisponibles.");
}""")
code("""// back/src/app.js lignes 62-68
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile-cv", profileCvRoutes);
app.use("/api/contact", contactRoutes);""")
pitch("App.jsx organise les pages du front avec React Router. api.js centralise les appels entre React et l'API. app.js configure le serveur Express et branche toutes les routes. Cette separation me permet d'avoir un projet clair : interface cote front, logique metier et securite cote back.")

h1("2. JWT : parcours complet depuis la connexion admin")
h2("Explication theorique simple")
p("Un JWT est un jeton numerique signe par le serveur. Apres une connexion reussie, le serveur donne ce jeton au front. Ensuite, le front l'envoie dans l'en-tete Authorization pour prouver qu'il est connecte. Le serveur verifie la signature du jeton avant d'autoriser les actions admin.")
h2("Pourquoi cette technologie")
p("JWT est utile ici parce que ton portfolio possede un espace administrateur. Les visiteurs peuvent consulter le site, mais seul l'admin peut creer, modifier ou supprimer les contenus. Le JWT evite de renvoyer le mot de passe a chaque requete.")
h2("Etapes concretes dans ton portfolio")
bullets([
    "L'admin saisit son email et son mot de passe dans AdminLogin.jsx.",
    "loginAdmin dans api.js envoie les identifiants a POST /api/auth/login.",
    "Le back cherche l'admin en base et compare le mot de passe avec bcrypt.",
    "Si c'est correct, le back cree un JWT avec jwt.sign.",
    "Le front stocke le token dans localStorage.",
    "Pour les routes admin, api.js ajoute Authorization: Bearer <token>.",
    "Le middleware requireAdminAuth verifie le token avec jwt.verify.",
])
table([
    ["Fichier", "Lignes utiles"],
    ["front/src/pages/AdminLogin.jsx", "lignes 33-34 : appel loginAdmin puis navigate('/admin')."],
    ["front/src/services/api.js", "lignes 96-107 : POST login et stockage du token."],
    ["front/src/services/api.js", "lignes 35-49 : ajout Authorization: Bearer."],
    ["back/src/routes/auth.routes.js", "lignes 16-27 : creation du token avec jwt.sign."],
    ["back/src/routes/auth.routes.js", "lignes 47-60 : verification identifiants et reponse token."],
    ["back/src/middlewares/authMiddleware.js", "lignes 22-43 : verification du token."],
])
code("""// back/src/routes/auth.routes.js lignes 16-27
function createAdminToken(admin) {
  const tokenPayload = { id: admin.id, email: admin.email, role: admin.role };
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  });
}""")
code("""// front/src/services/api.js lignes 43-49
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  ...options.headers,
}""")
code("""// back/src/middlewares/authMiddleware.js lignes 31-43
const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
if (!isAdminToken(decodedToken)) {
  return res.status(403).json({ message: "Acces reserve a l'administrateur." });
}
req.admin = decodedToken;
next();""")
pitch("Quand l'admin se connecte, le back verifie les identifiants avec bcrypt. Si c'est bon, il cree un JWT signe avec JWT_SECRET. Le front stocke ce token et l'envoie ensuite dans Authorization: Bearer. A chaque requete admin, le back verifie le token avec jwt.verify avant d'autoriser l'action.")

h1("3. CRUD projets : ajout ou modification depuis le dashboard")
h2("Explication theorique simple")
p("CRUD signifie Create, Read, Update, Delete. C'est la base d'une application dynamique : l'administrateur peut creer, lire, modifier et supprimer des donnees. Dans ton portfolio, le CRUD le plus clair est celui des projets.")
h2("Pourquoi c'est important")
p("Cette fonctionnalite prouve que le portfolio n'est pas seulement statique. Le contenu des projets peut etre gere depuis un back-office, stocke dans MongoDB et ensuite affiche sur les pages publiques.")
h2("Etapes concretes")
bullets([
    "Dans le dashboard, l'admin remplit le formulaire projet.",
    "saveProject regarde si editingProjectId existe.",
    "Si editingProjectId existe, le front appelle updateAdminProject.",
    "Sinon, il appelle createAdminProject.",
    "api.js envoie la requete vers /api/admin/projects avec le JWT.",
    "Le back valide les donnees avec projectRules.",
    "Mongoose cree ou modifie le document Project dans MongoDB.",
    "Le front recharge la liste avec getAdminProjects.",
])
table([
    ["Fichier", "Lignes utiles"],
    ["front/src/pages/admin/ProjectAdminSection.jsx", "lignes 20-93 : formulaire projet."],
    ["front/src/pages/AdminDashboard.jsx", "lignes 155-169 : saveProject."],
    ["front/src/pages/AdminDashboard.jsx", "ligne 175 : editProject."],
    ["front/src/services/api.js", "lignes 121-145 : get/create/update/delete projets."],
    ["back/src/routes/adminProjects.routes.js", "lignes 41-44 : createAdminProject."],
    ["back/src/routes/adminProjects.routes.js", "lignes 55-68 : updateAdminProject."],
    ["back/src/routes/adminProjects.routes.js", "lignes 89-92 : routes CRUD."],
    ["back/src/models/Project.js", "lignes 4-72 : modele Project."],
])
code("""// front/src/pages/AdminDashboard.jsx lignes 155-169
async function saveProject(event) {
  event.preventDefault();
  if (editingProjectId) {
    await updateAdminProject(editingProjectId, projectForm);
  } else {
    await createAdminProject(projectForm);
  }
  setProjects(await getAdminProjects());
}""")
code("""// back/src/routes/adminProjects.routes.js lignes 89-92
router.get("/", getAdminProjects);
router.post("/", validateRequest(projectRules), createAdminProject);
router.put("/:id", validateRequest([...projectIdRules, ...projectRules]), updateAdminProject);
router.delete("/:id", validateRequest(projectIdRules), deleteAdminProject);""")
pitch("Pour les projets, j'ai un CRUD complet. Cote front, le dashboard gere le formulaire. Si un projet est en edition, j'appelle updateAdminProject ; sinon createAdminProject. Cote back, les routes adminProjects valident les donnees puis utilisent Mongoose pour creer ou modifier le document Project dans MongoDB.")

h1("4. Validation : pourquoi front et back ?")
h2("Explication theorique simple")
p("La validation sert a verifier que les donnees envoyees sont correctes. La validation cote front ameliore l'experience utilisateur, car elle affiche rapidement une erreur. La validation cote back est obligatoire pour la securite, car un utilisateur peut contourner le front et appeler directement l'API.")
h2("Pourquoi les deux sont necessaires")
bullets([
    "Le front aide l'utilisateur a corriger rapidement son formulaire.",
    "Le back protege vraiment la base de donnees.",
    "Le back evite d'enregistrer des donnees incompletes ou mal formees.",
    "Le front ne doit jamais etre considere comme une securite suffisante.",
])
table([
    ["Exemple", "Code"],
    ["Validation front contact", "front/src/pages/Contact.jsx lignes 216-231."],
    ["Envoi contact", "front/src/pages/Contact.jsx lignes 62 et 70-71."],
    ["Validation back contact", "back/src/routes/contact.routes.js ligne 32."],
    ["Regles contact", "back/src/validators/portfolio.validators.js ligne 20."],
    ["Middleware generique", "back/src/middlewares/validateRequest.js ligne 2."],
    ["Validateurs communs", "back/src/validators/common.validators.js."],
])
code("""// front/src/pages/Contact.jsx lignes 216-231
function validateContactForm({ name, email, subject, message }) {
  if (!name || !email || !subject || !message) return "Merci de remplir tous les champs du formulaire.";
  if (!email.includes("@") || !email.includes(".")) return "Merci de saisir une adresse email valide.";
  if (message.trim().length < 10) return "Votre message doit contenir au moins 10 caracteres.";
  return null;
}""")
code("""// back/src/routes/contact.routes.js ligne 32
router.post("/", validateRequest(contactRules), createContactMessage);""")
pitch("J'ai mis une validation cote front pour guider l'utilisateur, par exemple sur le formulaire de contact. Mais je valide aussi cote back avec validateRequest, car la vraie securite est serveur. Meme si quelqu'un contourne React et appelle l'API directement, le back controle les donnees avant MongoDB.")

h1("5. MongoDB / Mongoose : role dans le projet")
h2("Explication theorique simple")
p("MongoDB est une base de donnees NoSQL orientee documents. Les donnees sont proches du format JSON. Mongoose est une couche entre Node.js et MongoDB : il permet de definir des schemas, manipuler les donnees avec des methodes JavaScript et structurer les documents.")
h2("Pourquoi ce choix pour ton portfolio")
bullets([
    "Les donnees du portfolio sont naturellement sous forme de documents : projets, CV, competences, messages.",
    "Le format JSON est coherent entre React, Express et MongoDB.",
    "Mongoose apporte une structure et evite d'avoir des documents trop libres.",
    "Les methodes comme find, create, findByIdAndUpdate et findByIdAndDelete simplifient le CRUD.",
])
table([
    ["Modele", "Role"],
    ["Project - back/src/models/Project.js lignes 4-72", "Structure des projets affiches sur le site."],
    ["Skill - back/src/models/Skill.js lignes 5-102", "Groupes de competences et statistiques."],
    ["ProfileCv - back/src/models/ProfileCv.js lignes 5-191", "CV complet avec formations, experiences, langues, etc."],
    ["ContactMessage - back/src/models/ContactMessage.js lignes 4-49", "Messages du formulaire de contact."],
    ["Admin - back/src/models/Admin.js lignes 4-41", "Compte admin avec passwordHash cache dans les reponses."],
])
code("""// back/src/models/Project.js lignes 4-14
const projectSchema = new mongoose.Schema(
  {
    sourceId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  }
);""")
code("""// back/src/routes/project.routes.js lignes 6-11
async function getProjects(req, res, next) {
  const projects = await Project.find().sort({ sourceId: 1 });
  res.json(projects);
}""")
code("""// back/src/models/Admin.js lignes 30-35
adminSchema.set("toJSON", {
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.passwordHash;
  },
});""")
pitch("MongoDB stocke les donnees dynamiques du portfolio sous forme de documents. Mongoose me sert a definir des modeles comme Project, Skill, ProfileCv, ContactMessage et Admin. Grace a ces modeles, je peux faire des CRUD propres et renvoyer au front des objets JSON structures.")

h1("Reponse ultra courte si le jury enchaine vite")
table([
    ["Question", "Reponse courte"],
    ["Architecture", "App.jsx gere les pages, api.js gere les appels HTTP, app.js configure Express et les routes API."],
    ["JWT", "Le back cree un token apres login, le front l'envoie dans Authorization, le back le verifie sur les routes admin."],
    ["CRUD projets", "Le dashboard envoie create/update/delete vers /api/admin/projects, le back valide puis agit sur MongoDB avec Mongoose."],
    ["Validation", "Front pour l'experience utilisateur, back pour la securite et la protection de la base."],
    ["Mongoose", "ODM qui structure les documents MongoDB et simplifie les operations CRUD."],
])
p("Astuce finale : si tu bloques, reviens toujours au flux simple : utilisateur -> composant React -> api.js -> route Express -> validation -> modele Mongoose -> MongoDB -> reponse JSON.")

doc = SimpleDocTemplate(str(PDF_PATH), pagesize=A4, rightMargin=1.45 * cm, leftMargin=1.45 * cm, topMargin=1.45 * cm, bottomMargin=1.55 * cm)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(PDF_PATH)
