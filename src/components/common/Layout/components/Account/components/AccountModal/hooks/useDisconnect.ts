import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { mutate } from "swr"
import { PlatformName } from "types"
import fetcher from "utils/fetcher"

type Data =
  | {
      platformName: PlatformName
    }
  | {
      address: string
    }

const useDisconnect = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateUser } = useUser()
  const { account } = useWeb3React()
  const { id } = useGuild()
  const toast = useToast()

  const submit = async ({ validation, data }: WithValidation<Data>) =>
    fetcher("/user/disconnect", {
      method: "POST",
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      mutateUser()
      mutate(`/guild/access/${id}/${account}`)

      toast({
        title: `Account disconnected!`,
        status: "success",
      })

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDisconnect
