'use client';

import { Button, Card, Chip, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const images = {
  studio:
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
  terrace:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  city: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  ada: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  alan: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
};

export function CardImage() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Flex flexWrap="wrap" gap="var(--space-16)" width="100%">
        <div style={{ flex: '1 1 16rem', minWidth: 0 }}>
          <Card
            title="Studio North"
            image={{ src: images.studio, alt: 'Bright studio interior with oak furniture' }}
            actions={<Chip text="Available" color="green" variant="surface" size="sm" />}
          >
            <Flex flexDirection="column" gap="var(--space-12)">
              <Paragraph>Open workspace in Şişli. 18 desks, north light, and a shared materials library.</Paragraph>
              <Flex alignItems="center" justifyContent="space-between" gap="var(--space-8)">
                <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>$2,480 / mo</span>
                <Button variant="outlined" color="blue" size="sm">
                  Tour
                </Button>
              </Flex>
            </Flex>
          </Card>
        </div>
        <div style={{ flex: '1 1 16rem', minWidth: 0 }}>
          <Card
            title="Terrace House"
            image={{ src: images.terrace, alt: 'Modern house with a planted terrace' }}
            actions={<Chip text="New" color="blue" variant="surface" size="sm" />}
          >
            <Flex flexDirection="column" gap="var(--space-12)">
              <Paragraph>Four-bed house with a planted roof and a ground-floor studio for the design team.</Paragraph>
              <Flex alignItems="center" justifyContent="space-between" gap="var(--space-8)">
                <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>$6,900 / mo</span>
                <Button variant="outlined" color="blue" size="sm">
                  Tour
                </Button>
              </Flex>
            </Flex>
          </Card>
        </div>
      </Flex>

      <Card
        title="Aurora Headquarters"
        image={{
          src: images.city,
          alt: 'Glass office towers at dusk',
          position: 'overlay',
          height: '18rem',
        }}
        actions={
          <Button variant="filled" color="white" size="sm">
            Visit
          </Button>
        }
      >
        <Paragraph color="var(--white-alpha-80)">
          Overlay puts the title and body on the photograph. A gradient keeps the type readable.
        </Paragraph>
      </Card>

      <Flex flexWrap="wrap" gap="var(--space-16)" width="100%">
        <div style={{ flex: '1 1 20rem', minWidth: 0 }}>
          <Card
            title="Ada Lovelace"
            image={{
              src: images.ada,
              alt: 'Portrait of Ada Lovelace',
              position: 'start',
              width: '7.5rem',
            }}
          >
            <Flex flexDirection="column" gap="var(--space-12)">
              <Paragraph size="sm" color="gray-500">
                Staff engineer
              </Paragraph>
              <Flex flexWrap="wrap" gap="var(--space-8)">
                <Chip text="Online" color="green" variant="surface" size="sm" />
                <Button variant="borderless" color="blue" size="sm">
                  Message
                </Button>
              </Flex>
            </Flex>
          </Card>
        </div>
        <div style={{ flex: '1 1 20rem', minWidth: 0 }}>
          <Card
            title="Alan Turing"
            image={{
              src: images.alan,
              alt: 'Portrait of Alan Turing',
              position: 'end',
              width: '7.5rem',
            }}
          >
            <Flex flexDirection="column" gap="var(--space-12)">
              <Paragraph size="sm" color="gray-500">
                Research
              </Paragraph>
              <Flex flexWrap="wrap" gap="var(--space-8)">
                <Chip text="Away" color="gray" variant="surface" size="sm" />
                <Button variant="borderless" color="blue" size="sm">
                  Message
                </Button>
              </Flex>
            </Flex>
          </Card>
        </div>
      </Flex>
    </Flex>
  );
}
