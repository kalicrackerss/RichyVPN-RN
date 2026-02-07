export class VLESSParser {
  static parse(vlessLink: string): {
    uuid: string;
    address: string;
    port: number;
    isRealityEnabled: boolean;
    realityParams?: Record<string, any>;
  } | null {
    try {
      // vless://uuid@address:port?параметры
      const url = new URL(vlessLink);
      
      if (url.protocol !== 'vless:') {
        console.error('Invalid VLESS link protocol');
        return null;
      }

      const uuid = url.username;
      const address = url.hostname;
      const port = parseInt(url.port, 10);

      const isRealityEnabled = url.searchParams.has('reality');
      const realityParams = isRealityEnabled ? {
        publicKey: url.searchParams.get('pbk'),
        serverName: url.searchParams.get('sni'),
        shortId: url.searchParams.get('sid'),
        fingerprint: url.searchParams.get('fp'),
      } : undefined;

      return {
        uuid,
        address,
        port,
        isRealityEnabled,
        realityParams,
      };
    } catch (error) {
      console.error('Error parsing VLESS link:', error);
      return null;
    }
  }

  static generateVLESSLink(
    uuid: string,
    address: string,
    port: number,
    params: Record<string, string> = {}
  ): string {
    let link = `vless://${uuid}@${address}:${port}`;
    const queryParams = new URLSearchParams(params);
    if (queryParams.toString()) {
      link += `?${queryParams.toString()}`;
    }
    return link;
  }
}

export const parseVLESSBatch = (links: string[]) => {
  return links
    .map(link => ({
      link,
      parsed: VLESSParser.parse(link),
    }))
    .filter(item => item.parsed !== null);
};
