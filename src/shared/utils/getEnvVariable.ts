export default function getEnvVariable(variableName: string) {
  const selectedVariable = import.meta.env[variableName];

  if (!selectedVariable) {
    throw new Error(`${variableName} is not configured`);
  }

  return selectedVariable;
}
