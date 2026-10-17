import { useDeferredValue, useMemo, useState } from "react";
import { UserPlus, Pencil, Ban, Trash2, CheckCircle2, UserCog, AlertCircle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import SearchInput from "../../components/common/SearchInput";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useAsyncData } from "../../hooks/useAsyncData";
import { employeeService } from "../../services/employeeService";
import { badgeService } from "../../services/badgeService";
import { matchesQuery } from "../../utils/search";
import { AppError, getErrorMessage } from "../../utils/errors";

const emptyForm = {
	name: "",
	username: "",
	email: "",
	phone: "",
	password: "123456",
};

const MIN_PASSWORD = 6;

const validate = (form, isEditing) => {
	const errors = {};
	if (!form.name.trim()) errors.name = "الاسم مطلوب";
	if (!form.username.trim()) errors.username = "اسم المستخدم مطلوب";
	else if (/\s/.test(form.username.trim())) errors.username = "اسم المستخدم لا يجب أن يحتوي على مسافات";
	if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
		errors.email = "البريد الإلكتروني غير صحيح";
	if ((!isEditing || form.password) && form.password.length < MIN_PASSWORD)
		errors.password = `كلمة المرور يجب ألا تقل عن ${MIN_PASSWORD} أحرف`;
	return errors;
};

const StatusPill = ({ active }) => (
	<span
		className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
			active
				? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
				: "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
		}`}
	>
		<span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
		{active ? "فعال" : "موقوف"}
	</span>
);

const AdminEmployees = () => {
	const { showToast } = useToast();
	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});
	const [saving, setSaving] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(null);

	const { data, loading, error, reload } = useAsyncData(
		async () => {
			const [employees, badges] = await Promise.all([
				employeeService.getEmployees(),
				badgeService.getBadges(),
			]);
			const badgeCounts = {};
			badges.forEach((b) => {
				badgeCounts[b.createdBy] = (badgeCounts[b.createdBy] || 0) + 1;
			});
			return { employees, badgeCounts };
		},
		[],
		{ employees: [], badgeCounts: {} },
	);
	const { employees, badgeCounts } = data;

	const filtered = useMemo(
		() =>
			employees.filter((e) => matchesQuery(deferredQuery, e.name, e.username, e.email, e.phone)),
		[employees, deferredQuery],
	);

	const closeModal = () => {
		if (!saving) setModalOpen(false);
	};

	const openAdd = () => {
		setEditingId(null);
		setForm(emptyForm);
		setErrors({});
		setModalOpen(true);
	};

	const openEdit = (employee) => {
		setEditingId(employee.id);
		setForm({
			name: employee.name,
			username: employee.username,
			email: employee.email || "",
			phone: employee.phone || "",
			password: "",
		});
		setErrors({});
		setModalOpen(true);
	};

	const setField = (field) => (e) => {
		setForm((current) => ({ ...current, [field]: e.target.value }));
		setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
	};

	const handleSave = async (event) => {
		event?.preventDefault();
		if (saving) return;
		const nextErrors = validate(form, Boolean(editingId));
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) return;

		setSaving(true);
		try {
			if (editingId) {
				const payload = {
					name: form.name,
					username: form.username,
					email: form.email.trim(),
					phone: form.phone.trim(),
				};
				if (form.password) payload.password = form.password;
				await employeeService.updateEmployee(editingId, payload);
				showToast("تم تحديث بيانات الموظف بنجاح");
			} else {
				await employeeService.createEmployee({
					...form,
					email: form.email.trim(),
					phone: form.phone.trim(),
					password: form.password || "123456",
				});
				showToast("تمت إضافة الموظف بنجاح");
			}
			setModalOpen(false);
			reload();
		} catch (err) {
			// الأخطاء المتوقعة (مثل اسم مستخدم مكرر) تُعرض للمستخدم ولا تُسجَّل كأخطاء برمجية
			if (!(err instanceof AppError)) console.error(err);
			setErrors({ form: getErrorMessage(err, "تعذر حفظ بيانات الموظف") });
		} finally {
			setSaving(false);
		}
	};

	const handleToggle = async (employee) => {
		try {
			await employeeService.toggleEmployeeStatus(employee.id);
			showToast(employee.status === "Active" ? "تم إيقاف حساب الموظف" : "تم تفعيل حساب الموظف");
			reload();
		} catch (err) {
			console.error(err);
			showToast(getErrorMessage(err, "تعذر تغيير حالة الحساب"), "error");
		}
	};

	const handleDelete = async () => {
		await employeeService.deleteEmployee(confirmDelete.id);
		showToast("تم حذف الموظف");
		reload();
	};

	// أزرار الإجراءات: أيقونات في الجدول، وأزرار بنص على بطاقات الجوال
	const actionButtons = (emp, { labelled = false } = {}) => {
		const active = emp.status === "Active";
		if (labelled) {
			return (
				<>
					<Button variant="secondary" size="sm" icon={Pencil} onClick={() => openEdit(emp)}>
						تعديل
					</Button>
					<Button
						variant="secondary"
						size="sm"
						icon={active ? Ban : CheckCircle2}
						onClick={() => handleToggle(emp)}
					>
						{active ? "إيقاف" : "تفعيل"}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						icon={Trash2}
						onClick={() => setConfirmDelete(emp)}
						className="text-rose-600 hover:bg-rose-50"
					>
						حذف
					</Button>
				</>
			);
		}
		const base = "p-1.5 rounded-md transition-colors";
		return (
			<>
				<button
					type="button"
					onClick={() => openEdit(emp)}
					title="تعديل"
					aria-label={`تعديل ${emp.name}`}
					className={`${base} hover:bg-slate-100 text-slate-500`}
				>
					<Pencil size={15} />
				</button>
				<button
					type="button"
					onClick={() => handleToggle(emp)}
					title={active ? "إيقاف" : "تفعيل"}
					aria-label={`${active ? "إيقاف" : "تفعيل"} ${emp.name}`}
					className={`${base} hover:bg-amber-50 text-amber-500`}
				>
					{active ? <Ban size={15} /> : <CheckCircle2 size={15} />}
				</button>
				<button
					type="button"
					onClick={() => setConfirmDelete(emp)}
					title="حذف"
					aria-label={`حذف ${emp.name}`}
					className={`${base} hover:bg-rose-50 text-rose-500`}
				>
					<Trash2 size={15} />
				</button>
			</>
		);
	};

	return (
		<>
			<PageHeader
				title="الموظفون"
				description="إدارة حسابات الموظفين وصلاحياتهم"
				actions={
					<Button icon={UserPlus} onClick={openAdd}>
						إضافة موظف
					</Button>
				}
			/>

			<Card>
				<SearchInput
					value={query}
					onChange={setQuery}
					placeholder="ابحث بالاسم أو اسم المستخدم..."
					className="max-w-sm mb-5"
				/>

				{loading ? (
					<LoadingState />
				) : error ? (
					<ErrorState onRetry={reload} />
				) : filtered.length === 0 ? (
					<EmptyState
						icon={UserCog}
						title={query ? "لا يوجد موظفون مطابقون للبحث" : "لا يوجد موظفون"}
						description={query ? undefined : "أضف أول موظف ليتمكن من تسجيل الدخول وإصدار البطاقات."}
						action={
							!query && (
								<Button icon={UserPlus} size="sm" onClick={openAdd}>
									إضافة موظف
								</Button>
							)
						}
					/>
				) : (
					<>
						<div className="hidden lg:block overflow-x-auto">
							<table className="w-full text-sm min-w-180">
								<thead>
									<tr className="text-right text-xs text-slate-500">
										<th scope="col" className="py-3 px-3 font-medium">الاسم</th>
										<th scope="col" className="py-3 px-3 font-medium">اسم المستخدم</th>
										<th scope="col" className="py-3 px-3 font-medium">البريد</th>
										<th scope="col" className="py-3 px-3 font-medium">الهاتف</th>
										<th scope="col" className="py-3 px-3 font-medium">عدد البطاقات</th>
										<th scope="col" className="py-3 px-3 font-medium">الحالة</th>
										<th scope="col" className="py-3 px-3 font-medium">الإجراءات</th>
									</tr>
								</thead>
								<tbody>
									{filtered.map((emp) => (
										<tr
											key={emp.id}
											className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
										>
											<td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">{emp.name}</td>
											<td className="py-3 px-3 text-slate-600 whitespace-nowrap">{emp.username}</td>
											<td className="py-3 px-3 text-slate-600 whitespace-nowrap">{emp.email || "—"}</td>
											<td className="py-3 px-3 text-slate-600 whitespace-nowrap">{emp.phone || "—"}</td>
											<td className="py-3 px-3 text-slate-600 whitespace-nowrap">
												{badgeCounts[emp.id] || 0}
											</td>
											<td className="py-3 px-3">
												<StatusPill active={emp.status === "Active"} />
											</td>
											<td className="py-3 px-3">
												<div className="flex items-center gap-1">{actionButtons(emp)}</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<ul className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-3">
							{filtered.map((emp) => (
								<li
									key={emp.id}
									className="rounded-xl border border-slate-100 p-3.5 flex flex-col gap-3"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<p className="text-sm font-bold text-slate-800 truncate">{emp.name}</p>
											<p className="text-xs text-slate-500" dir="ltr">
												@{emp.username}
											</p>
										</div>
										<StatusPill active={emp.status === "Active"} />
									</div>
									<dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
										<div className="min-w-0">
											<dt className="text-slate-400">البريد</dt>
											<dd className="text-slate-700 truncate">{emp.email || "—"}</dd>
										</div>
										<div>
											<dt className="text-slate-400">الهاتف</dt>
											<dd className="text-slate-700">{emp.phone || "—"}</dd>
										</div>
										<div>
											<dt className="text-slate-400">عدد البطاقات</dt>
											<dd className="text-slate-700">{badgeCounts[emp.id] || 0}</dd>
										</div>
									</dl>
									<div className="flex flex-wrap gap-2 pt-1 border-t border-slate-50">
										{actionButtons(emp, { labelled: true })}
									</div>
								</li>
							))}
						</ul>
					</>
				)}
			</Card>

			<Modal
				open={modalOpen}
				onClose={closeModal}
				dismissible={!saving}
				title={editingId ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
				footer={
					<>
						<Button variant="secondary" onClick={closeModal} disabled={saving}>
							إلغاء
						</Button>
						<Button type="submit" form="employee-form" loading={saving}>
							{editingId ? "حفظ التعديلات" : "إضافة"}
						</Button>
					</>
				}
			>
				<form id="employee-form" onSubmit={handleSave} noValidate className="flex flex-col gap-4">
					{errors.form && (
						<div
							role="alert"
							className="flex items-center gap-2 text-rose-600 bg-rose-50 rounded-lg px-3 py-2.5 text-xs"
						>
							<AlertCircle size={15} className="shrink-0" />
							{errors.form}
						</div>
					)}
					<Input
						label="الاسم الكامل"
						required
						value={form.name}
						onChange={setField("name")}
						error={errors.name}
						autoComplete="off"
					/>
					<Input
						label="اسم المستخدم"
						required
						value={form.username}
						onChange={setField("username")}
						error={errors.username}
						autoComplete="off"
						autoCapitalize="none"
						spellCheck={false}
					/>
					<Input
						label="البريد الإلكتروني"
						type="email"
						value={form.email}
						onChange={setField("email")}
						error={errors.email}
						autoComplete="off"
					/>
					<Input
						label="رقم الهاتف"
						type="tel"
						value={form.phone}
						onChange={setField("phone")}
						autoComplete="off"
					/>
					<Input
						label={editingId ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"}
						type="password"
						value={form.password}
						onChange={setField("password")}
						error={errors.password}
						hint={editingId ? "اتركها فارغة للإبقاء على كلمة المرور الحالية" : undefined}
						autoComplete="new-password"
					/>
				</form>
			</Modal>

			<ConfirmDialog
				open={!!confirmDelete}
				onClose={() => setConfirmDelete(null)}
				title="حذف الموظف"
				message={`هل أنت متأكد من حذف الموظف "${confirmDelete?.name}"؟ لن يتم حذف البطاقات التي أنشأها.`}
				confirmLabel="حذف"
				onConfirm={handleDelete}
			/>
		</>
	);
};

export default AdminEmployees;
