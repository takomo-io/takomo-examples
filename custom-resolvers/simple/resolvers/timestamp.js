module.exports = {
  name: "timestamp",
  init: (props) => {
    console.log("Initialize resolver: timestamp");
    return {
      confidential: () => false,
      dependencies: () => [],
      iamRoleArns: () => [],
      resolve: (input) => {
        input.logger.debug("Execute timestamp!");
        input.logger.debug(`Resolver value for parameter '${input.parameterName}'`);
        return Date.now();
      }
    }
  }
};
