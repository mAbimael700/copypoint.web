import { useStoreContext } from "@/features/stores/storage/useStoreContext";
import { CopypointCreationDTO } from "../Copypoint.type";
import useCopypoint from "../hooks/useCopypoint";
import { CopypointForm, CopypointFormValues } from "./copypoint-form";
import FormLayout from "@/components/layout/form-layout";
import { useNavigate } from "@tanstack/react-router";

const defaultValues = {
  name: ""
} satisfies CopypointCreationDTO

export default function CopypointCreateForm() {
  const { activeStore } = useStoreContext();
  const { createCopypoint } = useCopypoint(activeStore?.id || 0)
  const navigate = useNavigate()

  function onSubmit(values: CopypointFormValues): void {
    createCopypoint(values);
    navigate({ to: "/copypoints" })

  }

  return (
    <FormLayout header="Copypoint" description="Register a new store copypoint ">
      <CopypointForm defaultValues={defaultValues} handleSubmit={onSubmit} />
    </FormLayout>
  )
}
