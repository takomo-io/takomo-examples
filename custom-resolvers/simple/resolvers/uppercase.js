module.exports = {
  name: "uppercase",
  init: (props) => {
    console.log("Initialize resolver: uppercase");
    return {
      confidential: () => true,
      dependencies: () => [],
      iamRoleArns: () => [],
      resolve: (input) => {
        input.logger.debug("Execute uppercase!");
        input.logger.debug(`Resolver value for parameter '${input.parameterName}'`);
        return props.name.toUpperCase();
      }
    }
  }
};
