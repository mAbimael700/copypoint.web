import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/copypoints/phones/create',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/copypoints/phones/create"!</div>
}
