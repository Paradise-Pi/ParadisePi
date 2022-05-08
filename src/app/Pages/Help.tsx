import { Grid, Paper, SimpleGrid, Text } from "@mantine/core";
import React from "react";

export const HelpPage = () => {
  return (
    <>
      <Paper shadow="xl" p="lg" withBorder>
        <Text>Help</Text>
        <Text>
          Facility control panel for sACN & OSC, in Electron.
        </Text>
      </Paper>
    </>
    );
}
