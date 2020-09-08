const AWS = require("aws-sdk")

/**
 * Custom resolver that reads output from a stack.
 */
module.exports = {
  name: "output-reader",
  init: (props) => {
    console.log("Initialize resolver: output-reader");
    return {
      schema: (joi, schema) => {
        return schema.keys({
          stackName: joi.string().required(),
          role: joi.string().required(),
          region: joi.string().required(),
          outputName: joi.string().required(),
        })
      },
      iamRoleArns: [props.role],
      resolve: async (input) => {
        input.logger.debug("Execute resolver: output-reader");

        const cp = await input.ctx.getCredentialProvider().createCredentialProviderForRole(props.role)

        const cf = new AWS.CloudFormation({
          region: props.region,
          credentials: await cp.getCredentials()
        })

        const { Stacks } = await cf.describeStacks({ StackName: props.stackName }).promise()

        if (Stacks.length !== 1) {
          throw new Error("Expected exactly one matching stacks but got " + Stacks.length)
        }

        const outputs = Stacks[0].Outputs.filter(o => o.OutputKey === props.outputName).map(o => o.OutputValue)
        if (outputs.length > 1) {
          throw new Error("Expected exactly one matching output but got " + outputs.length)
        }

        return outputs[0]
      }
    }
  }
}
