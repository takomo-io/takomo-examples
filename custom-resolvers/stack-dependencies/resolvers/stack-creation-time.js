/**
 * Custom resolver that reads creation time from a stack.
 */
module.exports = {
  name: "stack-creation-time",
  init: (props) => {
    console.log("Initialize resolver: stack-creation-time");
    return {
      dependencies: [props.otherStack],
      schema: ({joi, base}) => {
        return base.keys({
          otherStack: joi.string().required()
        })
      },
      resolve: async (input) => {
        input.logger.debug("Execute resolver: stack-creation-time");

        const stacks = input.ctx.getStacksByPath(props.otherStack)
        if (stacks.length !== 1) {
          throw new Error("Expected exactly one matching stacks but got " + (stacks.length + 1))
        }

        const [ stack ] = stacks

        const client = await stack.getCloudFormationClient().getNativeClient()
        const { Stacks } = await client.describeStacks({ StackName: stack.name }).promise()
        if (Stacks.length !== 1) {
          throw new Error("Expected exactly one matching stacks but got " + Stacks.length)
        }

        const creationTime = Stacks[0].CreationTime

        input.logger.debug(`Resolved value for parameter '${creationTime}'`)
        return creationTime.getTime()
      }
    }
  }
}
