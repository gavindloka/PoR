import { useQueryCall } from "@ic-reactor/react"

const TestPage = () => {
    const { loading, data: user, refetch } = useQueryCall({
        functionName: 'getUser'
    })
    return (
        <div>{JSON.stringify(user)}</div>
    )
}

export default TestPage