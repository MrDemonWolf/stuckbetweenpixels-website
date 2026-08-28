import nathanial from "../assets/brand/hosts/nathanial-henniges.jpg";
import stephan from "../assets/brand/hosts/stephan-moerman.jpg";

export const hosts = [
	{
		slug: "nathanial-henniges",
		name: "Nathanial Henniges",
		photo: nathanial,
		role: "Founding engineer at Kommit",
		// Sourced from LinkedIn + the mrdemonwolf/website copy (Aug 2026). Leads
		// with Kommit (the current full-time role); MrDemonWolf, Inc. is the
		// S-Corp that publishes this show, so it stays named rather than framed
		// as a side project. Title there is President, not "Founder and CEO".
		bio: "Developer in Beloit, Wisconsin, building on the web since 2012. Founding engineer at Kommit, and president of MrDemonWolf, Inc., the Wisconsin S-Corp he incorporated in 2022 and the home for his own work: WordPress sites, TypeScript apps, and a pile of open-source tools built in public.",
		links: [
			{ label: "Website", href: "https://www.mrdemonwolf.com" },
			{ label: "GitHub", href: "https://github.com/MrDemonWolf" },
			{
				label: "LinkedIn",
				href: "https://www.linkedin.com/in/nathan-jk-henniges/",
			},
		],
	},
	{
		slug: "stephan-moerman",
		name: "Stephan Moerman",
		photo: stephan,
		role: "Founder of Kommit",
		// Sourced from moerman.dev (Aug 2026). The previous bio here was wrong:
		// he was Bakklog's part-time CTO from 2016–2026, not its founder/CEO,
		// and that chapter closed when he went full-time on Kommit.
		bio: "Founder of Kommit, the enterprise AI control plane teams use to design, monitor, and audit governed AI workflows in production. Based in the Netherlands. Previously spent a decade as a fractional CTO across SaaS, healthcare, fintech, and other regulated industries, alongside a part-time CTO role at Bakklog. Also co-founder and CTO of ShareShift, and on the DeveloperWeek Europe advisory board.",
		links: [
			{ label: "Website", href: "https://moerman.dev/" },
			{ label: "Kommit", href: "https://getkommit.ai" },
			{
				label: "LinkedIn",
				href: "https://www.linkedin.com/in/stephan-moerman/",
			},
		],
	},
];
