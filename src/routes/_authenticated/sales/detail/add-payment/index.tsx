import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/sales/detail/add-payment/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/sales/detail/add-payment/"!</div>
}
