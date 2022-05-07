import React, { Dispatch, SetStateAction, useState } from 'react';
import { createStyles, Navbar, Group, Code, Text } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { FaRegLightbulb, FaQuestion, FaCog, FaVolumeUp, FaVideo } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';
const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    navbar: {
      backgroundColor: theme.colors[theme.primaryColor][6],
    },

    version: {
      backgroundColor: theme.colors[theme.primaryColor][7],
      color: theme.white,
      fontWeight: 700,
    },

    text: {
      color: theme.white,
      fontWeight: 700,
      fontSize: '2rem',
    },

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.colors[theme.primaryColor][7]}`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.colors[theme.primaryColor][7]}`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.white,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colors[theme.primaryColor][5],
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.white,
      opacity: 0.75,
      marginRight: theme.spacing.sm,
      fontSize: '2rem',
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          opacity: 0.9,
        },
      },
    },
  };
});


const NavbarItem = ({link, label, Icon, active, setActive }: {link: string, label: string, Icon: IconType, active: string, setActive: Dispatch<SetStateAction<string>>}) => {
  const { classes, cx } = useStyles();
  return (
    <Link
      className={cx(classes.link, { [classes.linkActive]: label === active })}
      to={link}
      key={label}
      onClick={(event) => {
        setActive(label);
      }}
    >
      <Icon className={classes.linkIcon} />
      <span>{label}</span>
    </Link>
  );
}
export function NavbarSimpleColored() {
  const { classes } = useStyles();
  const { height } = useViewportSize();
  const [active, setActive] = useState('Help'); // Default page of help
  return (
    <Navbar height={height} width={{ sm: 200, md: 200 }} p="md" className={classes.navbar}>
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <Text className={classes.text}>ParadisePi</Text>
          <Code className={classes.version}>v3.1.2</Code>
        </Group>
        <NavbarItem link="projector" label="Projector" Icon={FaVideo} active={active} setActive={setActive} />
        <NavbarItem link="sound" label="Sound" Icon={FaVolumeUp} active={active} setActive={setActive}  />
        <NavbarItem link="lighting" label="Lighting" Icon={FaRegLightbulb} active={active} setActive={setActive}  />
      </Navbar.Section>
      <Navbar.Section className={classes.footer}>
        <NavbarItem link="help" label="Help" Icon={FaQuestion} active={active} setActive={setActive}  />
        <NavbarItem link="about" label="About" Icon={FaCog} active={active} setActive={setActive}  />
      </Navbar.Section>
    </Navbar>
  );
}