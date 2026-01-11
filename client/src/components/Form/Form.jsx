import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CircleChevronDown, Pencil, TrashIcon } from "lucide-react";
import StackIcons from "./StackIcons";
import ProjectForm from "./ProjectForm";
import DeleteDialog from "./DeleteDialog";
import EditProjectDialog from "./EditProjectDialog";
import FileUploadForm from "./file-upload.jsx";
import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/react";
import { TechStackNames } from "./StackIcons";
import { LOCAL_SERVER } from "@/constant.js";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";

// Define a Project class
class Project {
	constructor(id, title = "", techStacks = [], description = "") {
		this.id = id;
		this.title = title;
		this.techStacks = techStacks;
		this.description = description;
	}
}

// Define a Details class
class Details {
	constructor(
		userType = "guest",
		name = "",
		techStacks = [],
		experience = "Fresher",
		projects = []
	) {
		this.userType = userType;
		this.name = name;
		this.techStacks = techStacks;
		this.experience = experience;
		this.projects = projects;
	}
}
const Form = () => {
	const SERVER = import.meta.env.VITE_SERVER || LOCAL_SERVER;

	// Use a plain object for React state (avoids uncontrolled->controlled issues)
	const [details, setDetails] = useState({
		userType: "guest",
		name: "",
		techStacks: [],
		experience: "Fresher",
		projects: [],
	});

	const [projectForms, setProjectForms] = useState([{ id: 1 }]);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);

	const [query, setQuery] = useState("");

	const [isSubmitting, setIsSubmitting] = useState(false);

	const location = useLocation();
	const message = location.state?.message;
	const navigate = useNavigate();

	const { user, isAuthenticated } = useContext(AuthContext);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const payload = {
			userType: isAuthenticated ? "user" : details.userType || "guest",
			name: details.name,
			techStacks: details.techStacks,
			experience: details.experience,
			projects: details.projects,
		};

		// include userID when authenticated (backend expects Mongo ObjectID)
		if (isAuthenticated && user) {
			const rawId = user._id || user.id || null;
			// Send ObjectID in the Mongo driver's JSON shape so Go's decoder can unmarshal it
			if (rawId && typeof rawId === "string") {
				payload.userID = { "$oid": rawId };
			} else {
				payload.userID = rawId;
			}
		}

		console.log(payload);
		if (
			!payload.name || payload.name.trim() === "" ||
			!payload.techStacks || payload.techStacks.length === 0 ||
			!payload.experience || payload.experience.trim() === "" ||
			!payload.projects || payload.projects.length === 0
		) {
			toast.error("Please fill all the fields!");
			return;
		}
		setIsSubmitting(true);
		axios
			.post(`${SERVER}/api/v1/session`, payload)
			.then(function (response) {
				console.log(response);
				if (response && response.data) {
					localStorage.setItem("sessionId", response.data.data);
					localStorage.setItem("_id", response.data.data);
				}
				navigate("/camera-checkup");
			})
			.catch((err) => {
				const msg = err?.response?.data?.message || err.message || "Something went wrong";
				toast.error(msg);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	const addTechStack = (techStack) => {
		if (!techStack || techStack.trim() === "") return;
		if (details.techStacks.includes(techStack)) {
			setDetails((prevDetails) => ({
				...prevDetails,
				techStacks: prevDetails.techStacks.filter(
					(stack) => stack !== techStack
				),
			}));
		} else {
			setDetails((prevDetails) => ({
				...prevDetails,
				techStacks: [...prevDetails.techStacks, techStack],
			}));
		}
		setQuery("");
	};

	const filteredTechStack =
		query === ""
			? TechStackNames
			: TechStackNames.filter((techstack) => {
					return techstack
						.toLowerCase()
						.includes(query.toLowerCase());
			  });

	useEffect(() => {
		if (message) {
			toast.error(message, {
				action: {
					label: "Dismiss",
					onClick: () => {
						// noop
					},
				},
				style: {
					border: "2px solid #708090",
					background: "#6082B6",
				},
			});
		}
	}, [message]);

	return (
		<div className="bg-background pt-16 pb-4">
			<FileUploadForm
				details={details}
				setDetails={setDetails}
				projectForms={projectForms}
				setProjectForms={setProjectForms}
			/>
			<form
				className="mx-[5%] md:mx-[25%] py-2"
				onSubmit={(e) => handleFormSubmit(e)}
			>
				<div className="flex flex-col justify-start min-h-[100vh]">
					<h1 className="text-3xl text-foreground font-bold text-center">
						Please enter few details
					</h1>
					<div className="flex flex-col mt-5">
						<label className="text-foreground">Name</label>
						<input
							className="bg-card text-foreground p-2 rounded-md mt-2 placeholder-black placeholder-opacity-100"
							type="text"
							placeholder="Name"
							value={details.name || ""}
							disabled={isSubmitting}
							onChange={(e) =>
								setDetails((prevDetails) => ({
									...prevDetails,
									name: e.target.value,
								}))
							}
						/>
					</div>
					<div className="flex flex-col mt-5">
						<label className="text-foreground">Tech Stacks</label>
						<p className="text-sm leading-6 text-muted-foreground">
							Please select all tech stacks you are comfortable
							with. You can also add custom tech stacks.
						</p>
						{details.techStacks.length != 0 && (
							<div
								className={`bg-card text-foreground p-2 rounded-md flex ${
									details.techStacks.length > 6
										? "overflow-x-scroll"
										: null
								} min-w-[100%]`}
							>
								{details.techStacks.map((techStack, index) => {
									return (
										<div
											key={index}
											className="flex p-1 justify-center items-center mx-1 bg-card rounded-md transition-all"
										>
											<p>{techStack}</p>
											<svg
												onClick={() =>
													setDetails(
														(prevDetails) => ({
															...prevDetails,
															techStacks:
																prevDetails.techStacks.filter(
																	(stack) =>
																		stack !==
																		techStack
																),
														})
													)
												}
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2.0}
												stroke="red"
												className="size-5 justify-center cursor-pointer ml-1"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
												/>
											</svg>
										</div>
									);
								})}
							</div>
						)}
						<div className="bg-card text-foreground p-2 rounded-md mt-2">
							<Combobox
								as="div"
								value={query}
								onChange={addTechStack}
							>
								<ComboboxInput
									className={`bg-card text-foreground h-[2.25rem] min-w-full border m-[-0.30rem] p-2 placeholder-black placeholder-opacity-100`}
									aria-label="Tech Stacks"
									onChange={(event) =>
										setQuery(event.target.value)
									}
									value={query}
									placeholder="Search tech stacks..."
									disabled={isSubmitting}
								/>
								<ComboboxOptions className="mt-[0.30rem] border empty:invisible max-h-52 overflow-y-scroll">
									{filteredTechStack.map(
										(techStack, index) => (
											<ComboboxOption
												key={index}
												value={techStack}
												className="data-[focus]:bg-primary data-[focus]:text-primary-foreground cursor-pointer"
											>
												{techStack}
											</ComboboxOption>
										)
									)}
								</ComboboxOptions>
							</Combobox>
						</div>
						<div className="flex flex-wrap mt-2 items-center justify-around">
							<StackIcons
								details={details}
								setDetails={setDetails}
							/>
						</div>
					</div>
					<div className="flex flex-col mt-5">
						<legend className="text-foreground">Experience</legend>
						<div className="flex justify-start gap-3 mt-2">
							<div className="flex items-center ps-4 border rounded cursor-pointer">
								<input
									id="bordered-radio-1"
									type="radio"
									value="Fresher"
									name="experience"
									className="w-4 h-4 text-primary bg-card border focus:ring-primary focus:ring-2 cursor-pointer"
									checked={details.experience === "Fresher"}
									onChange={() => setDetails(prev => ({...prev, experience: "Fresher"}))}
								/>
								<label
									htmlFor="bordered-radio-1"
									className="text-foreground mx-4 py-4 cursor-pointer"
								>
									Fresher
								</label>
							</div>
							<div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 cursor-pointer">
								<input
									id="bordered-radio-2"
									type="radio"
									value="0-2 Years"
									name="experience"
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
									checked={details.experience === "0-2 Years"}
									onChange={() => setDetails(prev => ({...prev, experience: "0-2 Years"}))}
								/>
								<label
									htmlFor="bordered-radio-2"
									className="text-foreground mx-4 py-4 cursor-pointer"
								>
									0-2 Years
								</label>
							</div>
							<div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 cursor-pointer">
								<input
									id="bordered-radio-3"
									type="radio"
									value="2+ Years"
									name="experience"
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
									checked={details.experience === "2+ Years"}
									onChange={() => setDetails(prev => ({...prev, experience: "2+ Years"}))}
								/>
								<label
									htmlFor="bordered-radio-3"
									className="text-foreground mx-4 py-4 cursor-pointer"
								>
									2+ Years
								</label>
							</div>
						</div>
					</div>
					<div className="flex flex-col mt-5">
						<legend className="text-foreground">Projects</legend>
						<p className="text-sm leading-6 text-muted-foreground">
							Please add few best projects of yours. This will
							help us to understand your skills better.
						</p>
						{details.projects.map((project) => (
							<div key={project.id}>
								<div className="flex items-center justify-between bg-card rounded-md mt-5 px-2 py-1 gap-2">
									<div className="flex-col w-[90%] pr-2">
										<p className="text-slate-200 truncate">
											<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r to-emerald-500 from-sky-400">
												{project.title} |{" "}
											</span>
											{project.description}
										</p>

										<legend
											className={`${
												project.techStacks.length > 8
													? "overflow-x-scroll"
													: null
											} mt-2 mb-1`}
										>
											{project.techStacks.map(
												(techStack, index) => (
													<span
														key={index}
														className="mr-1 bg-card text-foreground text-xs px-2 py-1 rounded-md"
													>
														{techStack}
													</span>
												)
											)}
										</legend>
									</div>
									<div className="w-[10%] flex justify-end">
										<Menu as="div">
											<MenuButton className="inline-flex items-center gap-2 rounded-md bg-[#111826] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-[#111826]/6 data-[open]:bg-[#1E2A47] data-[focus]:outline-1 data-[focus]:outline-white">
												Options
												<CircleChevronDown className="size-4 fill-white/10" />
											</MenuButton>
											<MenuItems
												transition
												anchor="bottom end"
												className="w-52 origin-top-right rounded-xl border border-white/5 bg-[#1E2A47] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
											>
												<MenuItem>
													<button
														className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
														onClick={() =>
															setOpenEditDialog(
																true
															)
														}
													>
														<Pencil className="size-4 fill-white/30" />
														Edit
													</button>
												</MenuItem>
												<div className="my-1 h-px bg-white/5" />
												<MenuItem>
													<button
														className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
														onClick={() =>
															setOpenDeleteDialog(
																true
															)
														}
													>
														<TrashIcon className="size-4 fill-white/30" />
														Delete
													</button>
												</MenuItem>
											</MenuItems>
										</Menu>
									</div>
									<DeleteDialog
										openDeleteDialog={openDeleteDialog}
										setOpenDeleteDialog={
											setOpenDeleteDialog
										}
										project={project}
										setDetails={setDetails}
									/>
									<EditProjectDialog
										openEditDialog={openEditDialog}
										setOpenEditDialog={setOpenEditDialog}
										projectToBeEdited={project}
										details={details}
										setDetails={setDetails}
									/>
								</div>
							</div>
						))}
						<ProjectForm
							details={details}
							setDetails={setDetails}
							projectForms={projectForms}
							setProjectForms={setProjectForms}
						/>
					</div>
				</div>
				<button
					className="bg-[#2563EB] text-white p-2 rounded-md min-w-full mt-4 cursor-pointer text-center"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting
						? "Please wait while we take you to the dashboard"
						: "Submit"}
				</button>
			</form>
			{/* Toaster is mounted globally in App.jsx */}
		</div>
	);
};

export default Form;
